(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(document).ready(function() {
    var choices, extractLast, getFiles, split;
    choices = GET /gitignore/templates;
    getFiles = function() {
      var choice, gitignore, input, num, _results;
      gitignore = "";
      input = split($("#select").val()).filter(function(choice) {
        return choice !== "";
      });
      _results = [];
      for (num in input) {
        choice = input[num];
        if (choice !== "" && __indexOf.call(Object.keys(choices), choice) >= 0) {
          _results.push((function(choice) {
            return $.getGithubFile("github", "gitignore", choices[choice], function(contents) {
              gitignore = gitignore + "### " + choice + " ###\n" + contents + "\n\n";
              $("#output").text(gitignore);
              $("#output").attr("style", "");
              return $("#download").attr("style", "");
            });
          })(choice));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    split = function(val) {
      return val.split(/,\s*/);
    };
    extractLast = function(term) {
      return split(term).pop();
    };
    $("#select").bind("keydown", function(event) {
      if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
        event.preventDefault();
      }
      if (event.keyCode === 13 && !$(this).data("ui-autocomplete").menu.active) {
        event.preventDefault();
        return getFiles();
      }
    }).autocomplete({
      minLength: 0,
      mustMatch: true,
      source: function(request, response) {
        return response($.ui.autocomplete.filter(Object.keys(choices), extractLast(request.term)));
      },
      focus: function() {
        return false;
      },
      select: function(event, ui) {
        var terms;
        terms = split(this.value);
        terms.pop();
        terms.push(ui.item.value);
        terms.push("");
        this.value = terms.join(", ");
        return false;
      }
    });
    $("#generate").click(function() {
      return getFiles;
    });
    return $("#download").click(function() {
      var blob;
      blob = new Blob([$("#output").text()], {
        type: "text/plain;charset=utf-8"
      });
      return saveAs(blob, ".gitignore");
    });
  });

}).call(this);