import '@testing-library/jest-dom'

// recharts' ResponsiveContainer measures its parent via ResizeObserver,
// which jsdom doesn't implement — without a stub, every chart-bearing
// test would throw "ResizeObserver is not defined" before it even gets
// to assert anything.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- jsdom has no ResizeObserver; recharts only needs the shape above.
globalThis.ResizeObserver ??= ResizeObserverStub

// jsdom has no real layout engine, so every size-measuring API reports 0 —
// ResponsiveContainer would otherwise measure its container as 0x0 and skip
// rendering the chart's contents entirely. Stubbing all of them gives it a
// stable non-zero size so chart tests can assert on what's actually drawn.
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 })
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 300 })
Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 })
Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 300 })
Element.prototype.getBoundingClientRect = () =>
  ({
    width: 500,
    height: 300,
    top: 0,
    left: 0,
    right: 500,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON() {},
  }) as DOMRect
