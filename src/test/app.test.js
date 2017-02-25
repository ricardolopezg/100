import { renderComponent , expect } from './test.helper';
import App from './App.jsx';

describe('App' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(App);
  });

  it('show a comment-box', () => {
    expect(component.find('.comment-box')).to.exist;
  });
});
