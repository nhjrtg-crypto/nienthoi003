// Audio effects disabled per user request
class CosmicAudioEngine {
  public toggleAmbient(): boolean {
    return false;
  }

  public isAmbientActive(): boolean {
    return false;
  }

  public startAmbient() {
    // Disabled
  }

  public stopAmbient() {
    // Disabled
  }

  public playChime(_pitch?: 'low' | 'mid' | 'high' | 'sparkle') {
    // Sound effects completely removed
  }

  public playWinterCrystalChime() {
    // Sound effects disabled
  }

  public playSnowCrunch() {
    // Sound effects disabled
  }
}

export const cosmicAudio = new CosmicAudioEngine();

