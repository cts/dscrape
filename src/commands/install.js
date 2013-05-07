if (typeof CTSCLI == "undefined") {
  CTSCLI = {};
} 

CTSCLI.Install = function() {
};

CTSCLI.Install.prototype.help = function() {
  console.log(CTSCLI.Utilities.BANNER + 
    "  INSTALL\n" +
    "  =======\n\n" +
    "  Installs an HTML mockup.\n\n" +
    "  Usage: \n\n" +
    "    cts install <URL>   \n\n" +
    "    The URL can be: \n" +
    "      * A <Type>/<Name> index into the official CTS mockup repository\n" +
    "      * A path to a mockup package file on your local filesystem \n" +
    "      * A URL to a mockup package file\n" +
    "      * A \"Github URL\" of the form github://user/repo/path/to/file.json\n" +
    "        that points to a mockup package file.\n\n"); 
};

CTSCLI.Install.prototype.run = function(argv) {
  if (argv._.length < 3) {
    this.help();
    return;
  }

  var fileref = argv._[1];

  var self = this;

  CTSCLI.Utilities.fetchFile(
      fileref,
      function(str) {
        self.installPackage(JSON.parse(str));
      },
      console.log);
};

/**
 * Installs a mockup given a package.
 *
 * TODO(eob): Implement.
 */
CTSCLI.Install.prototype.installPackage = function(spec) {
  if (typeof spec.files != 'undefined') {
    this.installFiles([], spec.files);
  }
};

CTSCLI.Install.prototype.installFiles = function(relativePath, dirSpec) {
  var self = this;
  _.each(dirSpec, function(value, key) {
    var pathClone = relativePath.slice(0);
    pathClone.push(key);
    if (_.isArray(value)) {
      var fileSpec = value[0];
      var fileKind = value[1];
      this.installFile(pathClone, fileSpec, fileKind);
    } else if (_.isObject(value)) {
      this.installFiles(pathClone, value);
    } else {
      this.installFile(pathClone, value, 'utf8');
    }
  });
};

CTSCLI.Install.prototype.installFile = function(intoPath, fileSpec, kind) {
  var self = this;
  CTSCLI.Utilities.fetchFile(fileSpec,
      function(contents) {
        self.saveContents(intoPath, contents, kind);
      },
      function(error) {
        console.log(error);
      },
      kind
  );
};

CTSCLI.Install.prototype.saveContents = function(intoPath, contents, kind) {
  var fullPath = path.join(intoPath);
  if (kind == 'binary') {
    // the contents is a buffer object
    var data = contents.toString('binary');
    fs.writeFileSync(fullPath, data, 'binary');
  } else {
    fs.writeFileSync(fullPath, contents, kind);
  }
};