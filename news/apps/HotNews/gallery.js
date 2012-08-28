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
        this.layout = category.layout;
        this.feed;
        this.scrollPanel;
        if (this.layout == 'list' || this.layout == 'list_detail'
            || this.layout == 'list_img') {
          this.sizeVals = ['100%'];
        } else {
          // 3
          // 2 1
          // 1 2
          // 1 1 1
          this.sizeVals = ['100%', '66.6%', '33.3%', '33.3%', '66.6%'];
        }
      },

      loadScene: function () {
        this.scrollPanel = new tau.ui.ScrollPanel({
          styles: {
            fontSize: '15px',
           // padding: '10px',
          }
        });
        this.getScene().add(this.scrollPanel);
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
        // this.scrollPanel.renderer.addStyleRule(this.scrollPanel.getId(true),'*','font-family: "맑은 고딕"');
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
        var article = this.data[index];
        var panelStyle = {
          width: sizeVal,
          height: '150px',
          float: 'left',
          paddingLeft: '10px',
          borderBottom: '1px solid #BFBFBD',
          display: '-webkit-box',
          '-webkit-box-orient':'horizontal',
          '-webkit-box-align': (this.layout != 'list' && this.layout != 'list_detail') ? 'center' : 'start',
        };
        if (this.layout == 'list') {
          panelStyle.height = '45px';
        }
        if (this.layout == 'list_detail') {
          panelStyle.height = '90px';
        }
        if (this.layout == 'gallery') {
          panelStyle.paddingLeft = '0px';
          var imgSrc = this.getImgSrc(article);
          if (imgSrc) {
            panelStyle.backgroundImage = 'url("' + imgSrc + '")';
            panelStyle.backgroundSize = 'contain';
            panelStyle.color = 'white';
          }
        }

        if (index != 0) {
          panelStyle.borderTop = '1px solid #F2F2F0';
        }
        var panel = new tau.ui.Panel({
          styles: panelStyle,
        });
        
        if (this.layout == 'list_img') {
          var imgSrc = this.getImgSrc(article);
          if (imgSrc) {
            var imageView = new tau.ui.ImageView({
              src: imgSrc,
              styles: {
                width: '96px',
                marginRight: '10px',
                '-webkit-border-radius' : '5px',
              }
            });
            imageView.dArticleIndex = index;
            panel.add(imageView);
          }
        }
        var panel2Styles = {
            '-webkit-box-flex' : '1',
          };
        if(this.layout != 'list' && this.layout != 'list_detail') {
          panel2Styles.paddingRight = '3px';
        }
        var panel2 = new tau.ui.Panel({
          styles: panel2Styles,
        });
        panel.add(panel2);
        var title = new tau.ui.Label({
          text: article.title,
          styles: {
            display: 'block',
            fontWeight: 'bold',
           marginTop: '5px',
            marginBottom: '6px',
          }
        });
        
        panel2.add(title);
        if (this.layout != 'list' && sizeVal != '33.3%') {
          var description = new tau.ui.Label({
            text: article.contentSnippet.replace(/(\r\n|\n|\r)/gm, ""),
            styles: {
              fontSize: '80%',
              display: 'block',
              overflow: 'visible',
            }
          });
          panel2.add(description);
        }
        

        panel.onEvent('tap', this.articleSelected, this);
        panel.dArticleIndex = index;
        title.dArticleIndex = index;
        if (description)
          description.dArticleIndex = index;
        this.scrollPanel.add(panel);
      },
      articleSelected: function (e, payload) {
        var source = e.getSource();
        var index = source.dArticleIndex;
        if (index != undefined) {
          var article = this.data[index];
          var navigator = this.getParent();
          navigator.pushController(new hotnews.Article(article));
        }
      },

      getImgSrc: function (article) {
        var content = article.content;
        var reg = new RegExp("<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>");
        var result = reg.exec(content);
        if (result)
          return result[1];
      },

    });