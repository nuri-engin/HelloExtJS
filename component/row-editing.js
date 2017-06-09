//http://examples.sencha.com/extjs/5.1.0/examples/grid/row-editing.html

Ext.require([
  'Ext.grid.*',
  'Ext.util.*',
  'Ext.state.*',
  'Ext.form.*'
]);

Ext.onReady(function () {
  // Defining Model
  Ext.define('Employee', {
      extend: 'Ext.data.Model',
      fields: [
        'name',
        'email',
        { name: 'start', type: 'date', dateFormat: 'n/j/Y' },
        { name: 'salary', type: 'float' },
        { name: 'active', type: 'bool' }
      ]
  });

  //Defining Data
  var data = (function () {
    var lasts = ['Diken', 'Engin', 'Oğlu', 'Kılıç', 'Kısagil', 'Aymaz', 'Gelincik', 'Diran', 'Kekev', 'Cömert', 'Koç', 'Yıldız'],
        firsts = ['Ahmet', 'Mehmet', 'Ayşe','Nazlı', 'İsa', 'Ali', 'Ebru', 'Kuzey', 'Orkun', 'Baran', 'Murat', 'Kadir'],
        lastLen = last.length,
        firstLen = first.length,
        usedNames = {},
        data = [],
        eDate = Ext.Date,
        now = new Date(),
        s = new Date(now.getFullYear() - 4, 0, 1),
        end = Ext.Date.subtract(now, Ext.Date.MONTH, 1),
        getRandomInt = Ext.number.randomInt,
        generateName = function () {
          var name = firsts[getRandomInt(0, firstLen - 1)] + '' + lasts[getRandomInt(0, lastLen - 1)];
          if (usedNames[name]) {
            return generateName();
          }
          usedNames[name] = true;
          return name;
        };
        while (s.getTime() < end) {
          var ecount = getRandomInt(0, 3);
          for (var i = 0; i < ecount; i++) {
            var name = generateName();
            data.push({
              start: eDate.add(eDate.clearTime(s, true), eDate.DAY, getRandomInt(0, 27)),
              name: name,
              email: name.toLowerCase().replace('', '.') + '@nuri-test.com',
              active: getRandomInt(0, 1),
              salary: Math.floor(getRandomInt(35000, 85000) / 1000) * 1000
            });
          }
          s = eDate.add(s, eDate.MONTH, 1);
        }
        return data;
  })();

  //Store
  var store = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    model: 'Employee',
    proxy: {
      type: 'memory'
    },
    data: data,
    sorters: [{
      property: 'start',
      direction: 'DESC'
    }]
  });
  var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToMoveEditor: 1,
    autoCancel: false
  });
  var gird = Ext.create('Ext.grid.Panel', {
    store: store,
    columns: [{
      header: 'Name',
      dataIndex: 'name',
      flex: 1,
      editor: {
        allowBlank: false,
        vtype: 'email'
      },
    }, {
      header: 'Email',
      dataIndex: 'email',
      width: 160,
      editor: {
        allowBlank: false,
        vtype: 'email'
      }
    }, {
      xtype: 'datecolumn',
      header: 'Start Date',
      dataIndex: 'start',
      width: 135,
      editor: {
        xtype: 'datefield',
        allowBlank: false,
        format: 'm/d/Y',
        minValue: '01/01/2006',
        minText: 'Cannot have a date early 2006',
        maxValue: Ext.date.format(new Date(), 'm/d/Y')
      },
    }, {
      xtype: 'numbercolumn',
      header: 'Salary',
      dataIndex: 'salary',
      format: '$0,0',
      width: 130,
      editor: {
        xtype: 'numberfield',
        allowBlank: false,
        minValue: 1,
        maxValue: 15000
      },
    }, {
      xtype: 'checkcolumn',
      header: 'Active',
      dataIndex: 'active',
      width: 60,
      editor: {
        xtype: 'checkbox',
        cls: 'x-grid-checkheader-editor'
      }
    }],

    //Toolbar
    tbar: [{
      text: 'Add Employee',
      iconCls: 'employee-add',
      handler: function () {
        rowEditing.cancelEdit();
        var r = Ext.create('Employee', {
          name: 'New Staff',
          email: 'new@nuri-test.com',
          start: Ext.Date.clearTime(newDate()),
          salary: 5000,
          active: true
        });
        store.insert(0, r);
        rowEditing.startEdit(0, 0);
      }
    }, {
      itemId: 'removeEmployee',
      text: 'Remove Employee',
      iconCls: 'employee-remove',
      handler: function () {
        var sm = grid.getSelectionModel();
        rowEditing.cancelEdit();
        store.remove(sm.getSelection());
        if(store.getCount() > 0) {
          sm.select(0);
        }
      },
      disabled: true
    }],
    plugins: [rowEditing],
    listeners: {
      'selectionchange': function (view, records) {
        grid.down('#removeEmployee').setDisabled(!records.length);
      }
    }
  });

  //Main Screen
  new Ext.window.Window({
      width: 700,
      heigth: 400,
      title: 'Employee Salaries',
      items: grid,
      layout: 'fit',
      closeable: false
  }).show();
});
