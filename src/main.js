const {app, dialog, Menu, ipcMain, BrowserWindow} = require('electron')
const {writeFile} = require('fs')

let mainWindow

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => {
          const options = {
            title: 'Untitled',
            filters: [
              { name: 'docs', extensions: ['txt', 'text']},
              { name: 'all files', extensions: ['*'] }
            ],
            properties: ['openFile', 'createDirectory']
          }
          dialog.showSaveDialog(mainWindow, options, (filename) =>  {
            if (filename) {
              let data
              mainWindow.webContents.send('textRequest', null)
              ipcMain.on('text', (e, d) => {
                console.log('text: ', d);
                data = d
                console.log(data)
                writeFile(filename, data, (error) => {
                  if (error != null) {
                    console.log('error : ' + error);
                  }
                })
              })
            }
          })
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


//  初期化が完了した時の処理
app.on('ready', () => {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // メインウィンドウに表示するURLを指定します
  // （今回はmain.jsと同じディレクトリのindex.html）
  mainWindow.loadFile('./index.html');

  // デベロッパーツールの起動
  mainWindow.webContents.openDevTools();

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
})

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  // macOSのとき以外はアプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

// Cmd+Q?
app.on('will-quit', () => {
  console.log('will-quit')
})

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    // メインウィンドウを作成します
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // メインウィンドウに表示するURLを指定します
  // （今回はmain.jsと同じディレクトリのindex.html）
  mainWindow.loadFile('./src/index.html');

  // デベロッパーツールの起動
  mainWindow.webContents.openDevTools();

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  }
})
