// Vitest setup: lightweight Web Audio API and canvas mocks for JSDOM

// Mock AudioContext to prevent errors when components import it indirectly
class MockAnalyserNode {
  fftSize = 2048
  frequencyBinCount = 1024
  connect = () => {}
  disconnect = () => {}
  getByteFrequencyData = (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 255)
  }
}

class MockAudioContext {
  createAnalyser() {
    return new MockAnalyserNode()
  }
  createMediaElementSource() {
    return { connect: () => {} }
  }
  destination = {}
  close = async () => {}
}

// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.AudioContext = MockAudioContext as any
  // @ts-ignore
  window.webkitAudioContext = MockAudioContext as any
}

// Provide a basic canvas 2D context mock
if (typeof window !== 'undefined') {
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      clearRect: () => {},
      fillRect: () => {},
      fillStyle: '',
    }
  }
}
