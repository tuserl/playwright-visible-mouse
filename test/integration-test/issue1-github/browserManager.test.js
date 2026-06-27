const { BrowserManager, InteractionMode } = require('../../../index');

// Increase timeout since launching a real browser takes a few seconds
jest.setTimeout(30000);

describe('BrowserManager Integration Tests', () => {
  let manager;
  let session;

  beforeAll(async () => {
    manager = new BrowserManager();
    // Use INSTANT mode for fast test execution
    manager.setInteractionMode(InteractionMode.INSTANT);

    // Launch headless so it doesn't pop up windows constantly during testing
    session = await manager.launch({ headless: true });

    // Inject mock HTML to test against
    await session.page.setContent(`
      <html>
        <body>
          <input type="text" placeholder="Username" id="user-input" />
          <button>Submit Data</button>
          <label>Subscribe<input type="checkbox" /></label>
          <select name="country">
            <option value="us">United States</option>
            <option value="vn">Vietnam</option>
          </select>
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th></tr>
            </thead>
            <tbody>
              <tr><td>John</td><td>30</td></tr>
              <tr><td>Jane</td><td>25</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
  });

  afterAll(async () => {
    if (session && session.browser) {
      await session.browser.close();
    }
  });

  test('Field typing and clearing', async () => {
    const inputField = session.field('Username');

    // Test Type
    await inputField.type('Hello World');
    let inputValue = await inputField.loc.inputValue();
    expect(inputValue).toBe('Hello World');

    // Test Clear
    await inputField.clear();
    inputValue = await inputField.loc.inputValue();
    expect(inputValue).toBe('');
  });

  test('Button clicking', async () => {
    const submitBtn = session.btn('Submit Data');

    // Make sure it exists
    const exists = await submitBtn.exists(500);
    expect(exists).toBe(true);

    // Click it (just tests that the Playwright locator resolves and clicks)
    await submitBtn.click();
  });

  test('Dropdown select option', async () => {
    // Select option by name attribute
    await session.selectOption({ name: 'country' }, 'vn');

    // Verify State
    const state = await session.selectOptionOrGetState('country');
    expect(state.value).toBe('vn');
    expect(state.isRequired).toBe(false);
  });

  test('Table cell evaluation by text and index', async () => {
    // Get row index 1 (Jane), column 1 (Age)
    const ageCell = await session.tableCell(1, 1);
    const text = await ageCell.loc.innerText();
    expect(text).toBe('25');
  });

  test('Interaction Modes update correctly', () => {
    expect(session.InteractionMode.HUMAN).toBe('HUMAN');
    session.setInteractionMode(session.InteractionMode.NORMAL);
    expect(manager.mode).toBe('NORMAL');
  });
});
