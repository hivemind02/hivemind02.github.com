$require("/gallery.js");
$class('hotnews.Categories').extend(tau.ui.SceneController).define({
  Categories: function () {
    this.setTitle('Hot News');
  },

  init: function () {
    this.categories = [{
      id: 'top',
      title: 'Top Stories',
      url: 'http://mobileblog.olleh.com/rss',
      layout: 'list_img',
    }, {
      id: 'design',
      title: 'Design',
      url: 'http://dribbble.com/shots/popular.rss',
      layout: 'gallery',
    }, {
      id: 'web',
      title: 'Web',
      url: 'http://feeds.feedburner.com/devparan',
      layout: 'newsify',
    }, {
      id: 'java',
      title: 'Java',
      url: 'http://www.okjsp.pe.kr/rss/okjsp-rss2.jsp?bbs=bbs6',
      layout: 'list_detail',
    }, {
      id: 'eclipse',
      title: 'Eclipse',
      url: 'http://cafe.rss.naver.com/eclipseplugin',
      layout: 'list',
    }];
  },

  loadScene: function () {
    this.table = new tau.ui.Table({});
    this.table.onEvent(tau.ui.Table.EVENT_MODEL_LOAD, this.loadModel, this);
    this.table.onEvent(tau.ui.Table.EVENT_CELL_LOAD, this.loadCell, this);
    this.table.onEvent(tau.rt.Event.SELECTCHANGE, this.cellSelected, this);
    this.getScene().add(this.table);
    this.table.loadModel(true);
  },

  sceneDrawn: function () {
    // this.getParent().pushController(new hotnews.Gallery(category));
  },

  loadModel: function () {
    // TODO get categories from server
    this.table.addNumOfCells(this.categories.length);
  },

  loadCell: function (e, payload) {
    var index = payload.index;
    var cell = new tau.ui.TableCell({
      title: this.categories[index].title,
    });
    this.table.add(cell);
  },

  cellSelected: function (e, payload) {
    var current = payload.current;
    var index = this.table.indexOf(current);
    var category = this.categories[index];
    var gallery = new hotnews.Gallery(category);
    this.getParent().pushController(gallery);
  },

});