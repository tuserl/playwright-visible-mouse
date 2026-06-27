const { BrowserManager, createLocator } = require('../../../index');
const { chromium } = require('playwright');
const DemoMouse = require('../../../lib/demoMouse');

// --- Mock Dependencies ---
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
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
  let mockLocator;
  let mockPage;
  let mockContext;
  let mockBrowser;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Locator
    mockLocator = {
      waitFor: jest.fn().mockResolvedValue(true),
      click: jest.fn(),
      fill: jest.fn(),
      press: jest.fn(),
      clear: jest.fn(),
      focus: jest.fn(),
      textContent: jest.fn().mockResolvedValue(""),
      nth: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    };

    // Mock Page
    mockPage = {
      getByLabel: jest.fn().mockReturnValue(mockLocator),
      getByPlaceholder: jest.fn().mockReturnValue(mockLocator),
      getByRole: jest.fn().mockReturnValue(mockLocator),
      getByText: jest.fn().mockReturnValue(mockLocator),
      locator: jest.fn().mockReturnValue(mockLocator),

      goto: jest.fn(),
      evaluate: jest.fn(),
      waitForTimeout: jest.fn(),
      on: jest.fn(),
    };

    // Mock Browser Context
    mockContext = {
      addInitScript: jest.fn().mockResolvedValue(undefined),
      newPage: jest.fn().mockResolvedValue(mockPage),
    };

    // Mock Browser
    mockBrowser = {
      newContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn(),
    };

    chromium.launch.mockResolvedValue(mockBrowser);
  });

  // ---------------------------------------------------------
  // createLocator
  // ---------------------------------------------------------

  describe('createLocator', () => {
    it('should use defaultKey if options is a string', () => {
      createLocator(mockPage, 'Test Label', { defaultKey: 'label' });

      expect(mockPage.getByLabel)
        .toHaveBeenCalledWith('Test Label', { exact: true });
    });

    it('should handle options.text with custom default behavior', () => {
      const defaults = {
        text: jest.fn(),
      };

      createLocator(mockPage, { text: 'Submit' }, defaults);

      expect(defaults.text).toHaveBeenCalledWith('Submit');
    });

    it('should handle placeholder', () => {
      createLocator(mockPage, { placeholder: 'Enter name' });

      expect(mockPage.getByPlaceholder)
        .toHaveBeenCalledWith('Enter name');
    });

    it('should handle role + name', () => {
      createLocator(mockPage, {
        role: 'button',
        name: 'Submit',
      });

      expect(mockPage.getByRole)
        .toHaveBeenCalledWith('button', { name: 'Submit' });
    });

    it('should handle id selector', () => {
      createLocator(mockPage, { id: 'username' });

      expect(mockPage.locator)
        .toHaveBeenCalledWith('#username');
    });

    it('should handle class selector', () => {
      createLocator(mockPage, {
        class: 'btn btn-primary active',
      });

      expect(mockPage.locator)
        .toHaveBeenCalledWith('.btn.btn-primary.active');
    });

    it('should throw on unsupported selector', () => {
      expect(() =>
        createLocator(mockPage, { badKey: 'value' })
      ).toThrow('Unsupported selector.');
    });
  });

  // ---------------------------------------------------------
  // UIElement
  // ---------------------------------------------------------

  describe('UIElement', () => {
    it('should respect INSTANT mode for clicks', async () => {
      const manager = new BrowserManager();
      manager.setInteractionMode('INSTANT');

      const { btn, mouse } = await manager.launch();

      await btn('Submit').click();

      expect(mockLocator.click).toHaveBeenCalled();
      expect(mouse.clickHumanRandom).not.toHaveBeenCalled();
    });

    it('should respect HUMAN mode for typing', async () => {
      const manager = new BrowserManager();
      manager.setInteractionMode('HUMAN');

      const { field, mouse } = await manager.launch();

      await field('Username').type('JohnDoe');

      expect(mouse.typeHumanRandom)
        .toHaveBeenCalledWith(mockLocator, 'JohnDoe', 50);

      expect(mockLocator.fill).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------
  // BrowserManager
  // ---------------------------------------------------------

  describe('BrowserManager', () => {
    it('should update baseUrl when setUrl is called', () => {
      const manager = new BrowserManager();

      manager.setUrl('https://example.com');

      expect(manager.baseUrl).toBe('https://example.com');
    });

    it('should ignore invalid interaction modes', () => {
      const manager = new BrowserManager();

      manager.setInteractionMode('SUPER_FAST_MODE');
      expect(manager.mode).toBe('HUMAN');

      manager.setInteractionMode('INSTANT');
      expect(manager.mode).toBe('INSTANT');
    });

    it('should configure split2 geometry', async () => {
      const manager = new BrowserManager();

      await manager.launch({
        mode: 'split2',
        tileIndex: 1,
      });

      expect(chromium.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          args: expect.arrayContaining([
            '--window-position=960,0',
            '--window-size=960,1080',
          ]),
        })
      );
    });
  });
});
