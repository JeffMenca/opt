(function($) {
  var env = {
    'jeff': {
      'carne.txt': '201930643',
      'curso.txt': 'practicas iniciales'
    },
    'practicas': {
      'carne.txt': '201930643',
      'curso.txt': 'practicas iniciales'
    },
    'opt': {
      'definicion': 'Carpeta que suele utilizarse para almacenar software adicional que no es parte del sistema operativo base.',
      'ejemplo': 'Por ejemplo, si un usuario instala un software llamado "ejemplo", éste podría instalarse en la carpeta "/opt/ejemplo"',
      'resumen':'Es utilizada para almacenar software adicional en sistemas Unix y Linux que no es parte del sistema operativo base, lo que proporciona una estructura organizada para gestionar estos programas opcionales.',
    },
    'tareas.txt': 'No hay tareas pendientes',
    'apuntes.txt': 'parece que no hay apuntes',
    'oracion a Linus Torvalds': 'Practicas',
    'Linux': 'Practicas',
    'Distros': 'Practicas',
    'usb.jpg': 'Practicas',
    'linux.gif': 'Practicas'
  };

  function get(path) {
    var current = env;
    browser.walk(path, function(file) {
      current = current[file];
    });
    return current;
  }
  function remove(src) {
    var file = env;
    browser.walk(src, function(part, last) {
      var src = file[part];
      if (last) {
        delete file[part];
      }
      file = src;
    });
  }
  function process(src, dest, remove) {
    console.log('process ' + src + ' => ' + dest);
    var file = env;
    var name;
    browser.walk(src, function(part, last) {
      var src = file[part];
      if (last) {
        if (remove) {
          delete file[part];
        }
      }
      file = src;
    });
    var current = env;
    browser.walk(dest, function(part, last) {
      if (!last) {
        current = current[part];
      } else {
        name = part;
      }
    });
    current[name] = file;
    var defer = $.Deferred();
    // half second delay promise that simulate ajax upload
    setTimeout(function() {
      defer.resolve();
    }, 500);
    return defer.promise();
  }
  function upload(file, path) {
    var current = env;
    browser.walk(path, function(part) {
      if (!current[part]) {
        current[part] = {}; // upload new directory
      }
      current = current[part];
    });
    current[file.name] = 'new file ' + file.name;
    console.log('upload ' + file.name + ' to ' + path + ' directory');
    return $.when(true); // resolved promise
  }
  $('.browser').browse({
    root: '/',
    separator: '/',
    contextmenu: true,
    name: 'filestystem',
    menu: function(type) {
      if (type == 'li') {
        return {
          'play': function($li) {
            alert('winamp play "' + $li.text() + '"');
          },
          'add to playlist': function($li) {
            alert('playlist "' + $li.text() + '"');
          }
        }
      }
    },
    remove: function(src) {
      remove(src);
    },
    rename: function(src, dest) {
      return process(src, dest, true);
    },
    refresh_timer: 0,
    copy: process,
    dir: function(path) {
      dir = get(path);
      var result;
      if ($.isPlainObject(dir)) {
        result = {files:[], dirs: []};
        Object.keys(dir).forEach(function(key) {
          if (typeof dir[key] == 'string') {
            result.files.push(key);
          } else if ($.isPlainObject(dir[key])) {
            result.dirs.push(key);
          }
        });
      }
      return $.when(result); // resolved promise
    },
    upload: function(file, path) {
      return upload(file, path);
    },
    open: function(filename) {
      var file = get(filename);
      if (typeof file == 'string') {
        alert(file);
      }
    }
  });
  var browser = $('.browser').eq(0).browse();
})(jQuery);

github('jcubic/jquery.filebrowser');