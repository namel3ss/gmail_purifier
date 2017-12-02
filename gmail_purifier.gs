var purgables = [
  {
    name: 'purgable1',
    purgeAfter: 1,
  },
  {
    name: 'purgable3',
    purgeAfter: 3,
  },
  {
    name: 'purgable7',
    purgeAfter: 7,
  }
];

function intialize() {
  return;
}

function install() {
  ScriptApp.newTrigger('purify')
           .timeBased()
           .at(new Date((new Date()).getTime() + 1000*60*2))
           .create();

  ScriptApp.newTrigger('purify')
           .timeBased().everyDays(1).create();
}

function uninstall() {
  var triggers = ScriptApp.getScriptTriggers();
  for(var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function search(purgable) {
  var age = new Date();
  age.setDate(age.getDate() - purgable.purgeAfter);

  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return 'label:purgables/' + purgable.name + ' before:' + purge;
}

function purge(purgable) {
  var filter = search(purgable);

  var threads;

  try {
    do {
      threads = GmailApp.search(filter, 0, 500);

      for (var i = 0; i < threads.length; i++) {
        GmailApp.moveThreadToTrash(threads[i]);
      }
    } while(threads.length == 500)
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function purify() {
  for(var i = 0; i < purgables.length; i++) {
    purge(purgables[i]);
  }
}
