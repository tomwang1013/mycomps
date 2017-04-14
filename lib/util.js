function clickBody(e) {
  var target = e.target;
  var root = this.$el;

  while (target != root && target.nodeName != 'BODY') {
    target = target.parentNode;
  }

  // click on component itself
  if (target == root) return;

  // click outside
  this.isPopup = false;
  window.document.body.removeEventListener('click',
                                           clickBody.bind(this),
                                           false);
}

module.exports = {
  // 点击弹出框外面时关闭弹出框
  closePopOnClkOut: function() {
    window.document.body.addEventListener('click',
                                          clickBody.bind(this),
                                          false);
  }
};
