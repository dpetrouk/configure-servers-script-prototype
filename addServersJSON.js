#!/usr/bin/node

const readline = require( "readline" )
const fs = require( "fs" )
const path = require( "path" )

const fileName = "servers.json"

const prepareFileContents = (url) =>
{
    const serverURL = new URL( url )
    const { protocol, href } = serverURL
    const urlWithoutProtocol = href.split( `${protocol}//` )[ 1 ]
    const fileData = {
        protocol,
        destination: urlWithoutProtocol
    }
    const resultString = JSON.stringify( fileData, null, 4 )
    return resultString
}

const createFile = (dir, data) =>
{
    if ( !fs.existsSync(dir) )
    {
        fs.mkdirSync(dir);
    }
    const fullPath = path.join(dir, fileName)

    fs.writeFileSync( fullPath, data, "utf8" )
    console.log( `Файл ${fullPath} был добавлен.` )
}

const runInteractionMode = async () =>
{
    const rl = readline.createInterface(
        {
            input : process.stdin,
            output: process.stdout
        }
    )

    const ask = (str) => new Promise(resolve => rl.question(str, resolve));

    const dir = await ask( "Укажите путь к директории, где будет храниться конфигурация servers.json: ")
    // Путь указывается относительно директории с файлом package.json, в котором указан этот скрипт
    const url = await ask( "Укажите полный URL сервера: " )
    const resultString = prepareFileContents(url)

    createFile( dir, resultString )

    rl.close()

}

// const runArgumentsReceptionMode = () =>
// {
//     const passedArgs = process.argv.slice(2);
//     if (passedArgs.length > 0)
//     {
//         const [dir, url] = passedArgs
//         if (!(dir && url))
//         {
//             console.log('Были указаны не все аргументы. Продолжаем в интерактивном режиме.\n')
//             runInteractionMode()
//             return
//         }
//         const resultString = prepareFileContents(url)
//         createFile(dir, resultString)
//     } else
//     {
//         console.log('Аргументы не были указаны. Продолжаем в интерактивном режиме.\n')
//         runInteractionMode()
//     }
// }

// runArgumentsReceptionMode()

runInteractionMode()
