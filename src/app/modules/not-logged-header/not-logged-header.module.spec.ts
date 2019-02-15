import { NotLoggedHeaderModule } from './not-logged-header.module';

describe('NotLoggedHeaderModule', () => {
  let notLoggedHeaderModule: NotLoggedHeaderModule;

  beforeEach(() => {
    notLoggedHeaderModule = new NotLoggedHeaderModule();
  });

  it('should create an instance', () => {
    expect(notLoggedHeaderModule).toBeTruthy();
  });
});
