
var lBounds;

function openFile(loc) {
  loc = decodeURIComponent(loc);
  console.log(loc);
  var exec = require('child_process').exec;
  exec(loc);
}
function openLocation(loc) {
  loc = decodeURIComponent(loc);
  console.log(loc);
  var exec = require('child_process').exec;
  exec("start " + loc);
}
$(document).ready(function () {
  const remote = require('electron').remote;
  const electron = require('electron');
  const search = require('../modules/search').search;
  /*var db = new PouchDB('http://dev.villagrasa.ch:4444/polydex');
  db.info().then(function (info) {
    console.log(info);
  })*/
  $("#closeBtn").click(function() {
    console.log("click");
    var window = remote.getCurrentWindow();
       window.close();
  });

  $("#settingsBtn").click(function() {
    var win = remote.getCurrentWindow();
    lBounds = win.getBounds();
    console.log(lBounds);
    var bounds = lBounds;
    bounds.height = 440;
    win.setBounds(bounds);
    $('.settings').show();
  });

  $("#settingsDoneBtn").click(function() {
    $('.settings').hide();
    var win = remote.getCurrentWindow();
    setTimeout(function() {
      console.log(lBounds);
      win.setBounds(lBounds);
    }, 500);
  });

  $("#generalBtn").click(function() {
    $('.cat-general').show();
    $('.cat-sources').hide();
    $("#generalBtn").addClass("cat-active");
    $("#sourcesBtn").removeClass("cat-active");
  });
  $("#sourcesBtn").click(function() {
    $('.cat-general').hide();
    $('.cat-sources').show();
    $("#generalBtn").removeClass("cat-active");
    $("#sourcesBtn").addClass("cat-active");
  });

  function showResults() {
    var win = remote.getCurrentWindow();
    var bounds = win.getBounds();
    bounds.height = 500;
    win.setBounds(bounds);
    $('.results').show();
  }

  function addLocalSource() {
    const {dialog} = require('electron').remote
    return dialog.showOpenDialog({properties: ['openDirectory']});
  }
  $(document).keypress(function(e) {
    if(e.which == 13) {
      console.log("searching");
      search($('#searcher').val(), function(docs) {
        console.log(docs);
        $(".results").html("");
        $(".results").scrollTop(0);
          for (var i = 0; i < docs.length; i++) {
            for (var y = 0; y < docs[i].length; y++) {

              var fa = docs[i][y].path.split("\\");
              var fname = fa[fa.length-1];
              if(docs[i][y].line > -1){
                fname += (" Line: " +  (docs[i][y].line+1))
              }

              console.log("hap");
              var htTemplate = '<div class="document-item"><i class="fa fa-file fa-4x"></i><p class="fname">'+fname+'</p><p class="fpath">'+docs[i][y].path+'</p><button onClick="openLocation(\''+escape(docs[i][y].path.replace(fname, ""))+'\');" class="pathBtn" type="button" name="button"><i class="fa fa-folder-open" aria-hidden="true"></i></button> <button class="openBtn" type="button" name="button" onClick="openFile(\''+escape(docs[i][y].path)+'\');"><i class="fa fa-pencil" aria-hidden="true"></i></button> </div>'
              $(".results").append(htTemplate);
            }
          }
        if(docs.length > 0){
          showResults();
        }
        else{
          $('.results').hide();
        }
      });
    }
});
  $('#searcher').on('input', function() {

  });
});
