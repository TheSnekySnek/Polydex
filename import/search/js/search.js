
var lBounds;
var settingsSrcModel;
var providersModel;
const remote = require('electron').remote;
const electron = require('electron');
function connectToService() {
  var sType = $('.providerTable > table tr.active > td:nth-of-type(2)').text();

  switch (sType) {
    case "Local":
      const {dialog} = require('electron').remote;
      var dir = dialog.showOpenDialog({properties: ['openDirectory']});
      settingsSrcModel.sources.push({name: "Local", icon: "fa-folder", account: dir});
      saveSources();
      break;
    case "Google":
      break;
    case "Dropbox":
    var token = makeid();
    const BrowserWindow = remote.BrowserWindow;
    conWindow = new BrowserWindow({width: 800, height: 600, frame: false, transparent: false})
    conWindow.loadURL("https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=5reu87si7378b0x&redirect_uri=https://polydex.io/oauth/dropbox&state=" + token);
    checkDropboxAdded(token, conWindow);
      break;
    case "OneDrive":
      break;
    case "Github":
      break;
    default:

  }
  setTimeout(function() {
    $('.addSourceDiv').hide();
    loadSources();
  }, 500);
}
function checkDropboxAdded(token, bwindow) {
  var rq = require('request');
  rq.post({url: "https://polydex.io/listener", form:{"token": token}},
  function (err,httpResponse,body) {
    if(body != "err"){
      var resp = JSON.parse(body);
      console.log(resp);
      settingsSrcModel.sources.push({name: "Dropbox", icon: "fa-dropbox", account: "", "data": resp});
      saveSources();
      bwindow.close();
    }
    else{
      setTimeout(function() {
        checkDropboxAdded(token, bwindow);
      }, 1000);
    }
  });
}
function saveSources() {
  const storage = require('electron-json-storage');
    storage.set('sources', settingsSrcModel.sources, function(error) {
    if (error){
      console.log(error);
    }
  });
}
function loadSources() {
  const storage = require('electron-json-storage');
  storage.get('sources', function(error, data) {
    if (error){
      console.log(error);
    }
    else if(data.length > 0){
      settingsSrcModel.sources = data;
      console.log(data);
    }
  });
}
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function deleteSource(index) {
  settingsSrcModel.sources.splice(index, 1);
  console.log(settingsSrcModel.sources);
  saveSources();
  setTimeout(function() {
    loadSources();
  }, 500);
}
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


  const search = require('../modules/search');
  settingsSrcModel = new Vue({
    el: '.sourceTable',
    data:{
      sources: []
    },
    methods : {

            delete : function (deleteIndex) {
              settingsSrcModel.sources.splice(deleteIndex, 1);
              console.log(settingsSrcModel.sources);
              saveSources();
              setTimeout(function() {
                loadSources();
              }, 500);
            }
        }
  });
  providersModel = new Vue({
    el: '.providerTable',
    data:{
      providers: [
        {name: "Local", icon: "fa-folder", default: true},
        {name: "Dropbox", icon: "fa-dropbox"},
        {name: "Google", icon: "fa-google"},
        {name: "OneDrive", icon: "fa-windows"},
        {name: "Github", icon: "fa-github"}
      ]
    }
  });
  $("#closeBtn").click(function() {
    console.log("click");
    var window = remote.getCurrentWindow();
       window.close();
  });

  $("#settingsBtn").click(function() {
    loadSources();
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
      search.search($('#searcher').val(), function(docs) {
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
});
