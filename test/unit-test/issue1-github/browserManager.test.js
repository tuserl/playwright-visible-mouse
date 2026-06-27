const { BrowserManager, createLocator } = require('../../../index'); // Update path as needed
const { chromium } = require('playwright');
const DemoMouse = require('../../../lib/demoMouse');

// --- Mocking Dependencies ---
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn()
  }
}));

jest.mock('../../../lib/demoMouse', () => {
  return jest.fn().mockImplementation(() => ({
    install: jest.fn(),
    focus: jest.fn(),
    click: jest.fn(),
    clickHumanRandom: jest.fn(),
    moveTo: jest.fn(),
    type: jest.fn(),
    typeHumanRandom: jest.fn(),
  }));
});

describe('BrowserManager & UIElement Test Suite', () => {
  let mockPage;
  let mockLocator;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup a generic mock locator
    mockLocator = {
      waitFor: jest.fn().mockResolvedValue(true),
      click: jest.fn(),
      fill: jest.fn(),
      press: jest.fn(),
      clear: jest.fn(),
      focus: jest.fn(),
      nth: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    };

    // Setup a generic mock page
    mockPage = {
      getByLabel: jest.fn().mockReturnValue(mockLocator),
      getByPlaceholder: jest.fn().mockReturnValue(mockLocator),
      getByRole: jest.fn().mockReturnValue(mockLocator),
      locator: jest.fn().mockReturnValue(mockLocator),
      getByText: jest.fn().mockReturnValue(mockLocator),
    };
  });

  // ---------------------------------------------------------
  // 1. Testing createLocator Helper
  // ---------------------------------------------------------
  describe('createLocator', () => {
    it('should use defaultKey if options is a string', () => {
      createLocator(mockPage, 'Test Label', { defaultKey: 'label' });
      expect(mockPage.getByLabel).toHaveBeenCalledWith('Test Label', { exact: true });
    });

    it('should handle options.text with custom default behavior', () => {
      const defaults = { text: jest.fn() };
      createLocator(mockPage, { text: 'Submit' }, defaults);
      expect(defaults.text).toHaveBeenCalledWith('Submit');
    });

    it('should handle options.placeholder', () => {
      createLocator(mockPage, { placeholder: 'Enter name' });
      expect(mockPage.getByPlaceholder).toHaveBeenCalledWith('Enter name');
    });

    it('should handle options.role and options.name', () => {
      createLocator(mockPage, { role: 'button', name: 'Submit' });
      expect(mockPage.getByRole).toHaveBeenCalledWith('button', { name: 'Submit' });
    });

    it('should handle options.id', () => {
      createLocator(mockPage, { id: 'user-id' });
      expect(mockPage.locator).toHaveBeenCalledWith('#user-id');
    });

    it('should handle options.class (joining spaces to dots)', () => {
      createLocator(mockPage, { class: 'btn btn-primary active' });
      expect(mockPage.locator).toHaveBeenCalledWith('.btn.btn-primary.active');
    });

    it('should throw an error for unsupported selectors', () => {
      expect(() => {
        createLocator(mockPage, { unknownKey: 'value' });
      }).toThrow('Unsupported selector.');
    });
  });

  // ---------------------------------------------------------
  // 2. Testing UIElement & Interaction Modes
  // ---------------------------------------------------------
  describe('UIElement', () => {
    let mode;

    beforeEach(() => {
      mode = 'NORMAL';
      const getModeFn = () => mode;
    });

    it('should respect INSTANT mode for clicks', async () => {
      const manager = new BrowserManager();
      manager.setInteractionMode('INSTANT');

      // Mock the entire launch process
      const mockContext = { newPage: jest.fn().mockResolvedValue(mockPage) };
      const mockBrowser = { newContext: jest.fn().mockResolvedValue(mockContext) };
      chromium.launch.mockResolvedValue(mockBrowser);
      mockPage.goto = jest.fn();
      mockPage.evaluate = jest.fn();

      // FIX: Destructure `mouse` directly from the launch result
      const { btn, mouse } = await manager.launch();
      const myBtn = btn('Submit'); // Returns a UIElement

      await myBtn.click();

      // INSTANT mode should call locator.click directly
      expect(mockLocator.click).toHaveBeenCalled();

      // Should NOT call mouse methods
      expect(mouse.clickHumanRandom).not.toHaveBeenCalled();
    });

    it('should respect HUMAN mode for typing', async () => {
      const manager = new BrowserManager();
      manager.setInteractionMode('HUMAN');

      const mockContext = { newPage: jest.fn().mockResolvedValue(mockPage) };
      const mockBrowser = { newContext: jest.fn().mockResolvedValue(mockContext) };
      chromium.launch.mockResolvedValue(mockBrowser);
      mockPage.goto = jest.fn();
      mockPage.evaluate = jest.fn();

      // FIX: Destructure `mouse` directly from the launch result
      const { field, mouse } = await manager.launch();
      const myField = field('Username');

      await myField.type('JohnDoe');

      // HUMAN mode should use typeHumanRandom on the returned mouse instance
      expect(mouse.typeHumanRandom).toHaveBeenCalledWith(mockLocator, 'JohnDoe', 50);
      expect(mockLocator.fill).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------
  // 3. Testing BrowserManager
  // ---------------------------------------------------------
  describe('BrowserManager', () => {
    it('should update baseUrl when setUrl is called', () => {
      const manager = new BrowserManager();
      manager.setUrl('https://example.com');
      expect(manager.baseUrl).toBe('https://example.com');
    });

    it('should ignore invalid interaction modes', () => {
      const manager = new BrowserManager();
      manager.setInteractionMode('SUPER_FAST_MODE'); // Invalid
      expect(manager.mode).toBe('HUMAN'); // Should remain default

      manager.setInteractionMode('INSTANT'); // Valid
      expect(manager.mode).toBe('INSTANT');
    });

    it('should properly configure split2 window geometry', async () => {
      const manager = new BrowserManager();
      const mockContext = { newPage: jest.fn().mockResolvedValue(mockPage) };
      const mockBrowser = { newContext: jest.fn().mockResolvedValue(mockContext) };
      chromium.launch.mockResolvedValue(mockBrowser);
      mockPage.goto = jest.fn();
      mockPage.evaluate = jest.fn();

      await manager.launch({ mode: 'split2', tileIndex: 1 });

      expect(chromium.launch).toHaveBeenCalledWith(expect.objectContaining({
        args: expect.arrayContaining([
          '--window-position=960,0',
          '--window-size=960,1080'
        ])
      }));
    });
  });
});
