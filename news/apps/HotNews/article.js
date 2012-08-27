$class('hotnews.Article').extend(tau.ui.SceneController).define({
  Article: function (article) {
    this.article = article;
  },

  loadScene: function () {
    var textView = new tau.ui.TextView({
      id: 'textView1',
      text: this.article.content,
    });
    this.getScene().add(textView);
  },

  sceneLoaded: function () {
    var textView = this.getScene().getComponent('textView1');
    textView.renderer
        .addStyleRule(textView.getId(true), 'img', 'max-width: 100%; height: auto;');
    textView.renderer
    .addStyleRule(textView.getId(true), 'span', 'max-width: 100%; height: auto;');
  },

});