const { renderComponent, expect } = require('./test.helper.js');
const CommentBox = require('./../components/Messenger/CommentBox.jsx').default;

describe('CommentBox', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(CommentBox);
  });

  it('has a textarea', () => {
    expect(component.find('textarea')).to.exist;
  });

  it('has a button', () => {
    expect(component.find('button')).to.exist;
  });

  it('has a className of comment-box', () => {
    expect(component).to.have.class('comment-box');
  });

  describe('Text Updating', () => {
    beforeEach(() => {
      component.find('textarea').simulate('change', 'new comment');
    });

    it('should have a specific value', () => {
      expect(component.find('textarea')).to.have.value('new comment');
    });

    it('should reset on submit', () => {
      component.find('button').simulate('click');
      expect(component.find('textarea')).to.have.value('');
    });
  });
});
