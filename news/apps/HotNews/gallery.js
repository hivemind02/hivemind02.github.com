$require("/categories.js");
$require("/article.js");
$require('http://www.google.com/jsapi');

$class('hotnews.Gallery')
    .extend(tau.ui.SceneController)
    .define({

      $static: {
        EVENT_LIB_LOADED: 'googleLibLoaded'
      },

      Gallery: function (category) {
        this.setTitle(category.title);
        this.url = category.url;
        this.data = [];
        this.feed;
        this.scrollPanel;
        // 3
        // 2 1
        // 1 2
        // 1 1 1
        // this.sizeVals = ['100%', '66.6%', '33.3%', '33.3%', '66.6%'];
        this.sizeVals = ['100%'];
      },

      loadScene: function () {
        this.scrollPanel = new tau.ui.ScrollPanel({
          styles: {
            fontSize: '15px',
            padding: '10px',
          }
        });
        this.getScene().add(this.scrollPanel);

        var nav = this.getNavigationBar();
        var navBtn = new tau.ui.Button({
          styles: {
            marginLeft: '10px',
            width: '38px',
            backgroundImage: 'url("/img/navBtn.png")',
            display: '-webkit-box',
          },
          styleClass: {
            type: 'sanmarino'
          },
        });
        navBtn.onEvent('tap', this.navBtnTapped, this);
        // nav.setLeftItem(navBtn);
      },

      navBtnTapped: function () {
        var navigator = this.getParent();
        navigator.pushController(new hotnews.Categories());
      },

      sceneLoaded: function () {
        function onLoad () {
          this.loadModel();
        }
        google.load("feeds", "1", {
          "callback": tau.ctxAware(onLoad, this)
        });
        // this.scrollPanel.renderer.addStyleRule(this.scrollPanel.getId(true),'*','font-family:
        // "맑은 고딕"');
        this.scrollPanel.renderer
            .addStyleRule(this.scrollPanel.getId(true), '.tau-label-text', 'overflow: visible');
      },

      loadModel: function () {
        if (!this.feed) {
          this.feed = new google.feeds.Feed(this.url);

          function feedLoaded (result) {
            if (!result.error && result.feed) {
              var entries = result.feed.entries;
              this.data = this.data.concat(entries);
              this
                  .addCells(this.data.length - entries.length, entries ? entries.length
                      : 0);
            }
          }
        }

        this.feed.setNumEntries(100);
        this.feed.load(tau.ctxAware(feedLoaded, this));
        this.feed.load(tau.ctxAware(feedLoaded, this));
      },

      addCells: function (index, length) {
        for ( var i = index, end = index + length; i < end; i++) {
          this.loadCell(i);
        }
        this.getScene().update();
      },

      loadCell: function (index) {
        var sizeVal = this.sizeVals[index % this.sizeVals.length];
        var data = this.data[index];
        var panelStyle = {
          width: sizeVal,
          height: '120px',
          float: 'left',
          borderBottom: '1px solid #BFBFBD',
        };
        if (index != 0) {
          panelStyle.borderTop = '1px solid #F2F2F0';
        }
        var panel = new tau.ui.Panel({
          styles: panelStyle,
        });

        var title = new tau.ui.Label({
          text: data.title,
          styles: {
            display: 'block',
            fontWeight: 'bold',
            fontSize: '110%',
            marginTop: '10px',
            marginBottom: '6px',
          }
        });
        panel.add(title);
        var description = new tau.ui.Label({
          text: data.contentSnippet.replace(/(\r\n|\n|\r)/gm, ""),
          styles: {
            fontSize: '90%',
            display: 'block',
            overflow: 'visible',
          }
        });
        panel.add(description);
        panel.onEvent('tap', this.articleSelected, this);
        title.dArticleIndex = index;
        description.dArticleIndex = index;
        this.scrollPanel.add(panel);
      },
      articleSelected: function (e, payload) {
        var source = e.getSource();
        var index = source.dArticleIndex;
        var article = this.data[index];
        var navigator = this.getParent();
        navigator.pushController(new hotnews.Article(article));
      },

    });