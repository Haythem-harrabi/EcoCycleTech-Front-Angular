import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera-detection',
  templateUrl: './camera-detection.component.html',
  styleUrls: ['./camera-detection.component.css']
})
export class CameraDetectionComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  
  // Keep all your existing properties
  cameraActive = false;
  currentFrame: string | null = null;
  frameInterval: any;
  detectionActive = true;
  serverUrl = 'http://localhost:5016';
  isLoading = false;
  error: string | null = null;
  detectedObjects: {label: string, confidence: number}[] = [];
  lastDetectionTime: Date | null = null;
  pulseActive = false;
  scanActive = false;


  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkServerStatus();
  }
  onClose(): void {
    this.stopCamera();
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.frameInterval) {
      clearInterval(this.frameInterval);
    }
  }

  checkServerStatus(): void {
    this.http.get(`${this.serverUrl}/api/camera/test`).subscribe({
      next: () => {
        console.log('Server is running');
        this.getInitialStatus();
      },
      error: (err) => {
        console.error('Server connection error:', err);
        this.error = 'Could not connect to camera server. Make sure the Flask backend is running.';
      }
    });
  }

  getInitialStatus(): void {
    this.http.get(`${this.serverUrl}/api/camera/status`).subscribe({
      next: (response: any) => {
        if (response.active) {
          this.cameraActive = true;
          this.startFrameUpdates();
        }
        this.detectionActive = response.detection_active;
      },
      error: (err) => {
        console.error('Error getting initial status:', err);
      }
    });
  }

  toggleCamera(): void {
    if (this.cameraActive) {
      this.stopCamera();
    } else {
      this.startCamera();
    }
  }

  startCamera(): void {
    this.isLoading = true;
    this.http.post(`${this.serverUrl}/api/camera/start`, {}).subscribe({
      next: () => {
        this.cameraActive = true;
        this.isLoading = false;
        this.startFrameUpdates();
      },
      error: (err) => {
        console.error('Error starting camera:', err);
        this.error = 'Failed to start camera. Make sure no other application is using the camera.';
        this.isLoading = false;
      }
    });
  }

  stopCamera(): void {
    this.http.post(`${this.serverUrl}/api/camera/stop`, {}).subscribe({
      next: () => {
        this.cameraActive = false;
        this.detectionActive = false;
        this.currentFrame = null;
        if (this.frameInterval) {
          clearInterval(this.frameInterval);
        }
      },
      error: (err) => {
        console.error('Error stopping camera:', err);
        this.error = 'Failed to stop camera';
      }
    });
  }

  startFrameUpdates(): void {
    this.frameInterval = setInterval(() => {
      this.http.get(`${this.serverUrl}/api/camera/frame`).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.frame) {
            this.currentFrame = 'data:image/jpeg;base64,' + response.frame;
            this.lastDetectionTime = new Date();
          }
        },
        error: (err) => {
          console.error('Error getting frame:', err);
        }
      });
    }, 100);
  }

  toggleDetection() {
    this.http.post(`${this.serverUrl}/api/camera/toggle-detection`, {}).subscribe({
      next: (response: any) => {
        this.detectionActive = response.detection_active;
        this.pulseActive = this.detectionActive;
        this.scanActive = this.detectionActive;
        
        if (this.detectionActive) {
          setTimeout(() => this.pulseActive = false, 1000);
          setTimeout(() => this.scanActive = false, 2000);
        }
      },
      error: (err) => console.error('Error toggling detection:', err)
    });
  }
}