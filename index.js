const fs = require('fs')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')
const {
    hotelsInfo, hostelsInfo, restaurantsInfo, cafesInfo,
    museumsInfo, theatersInfo, parksInfo, sightsInfo,
    questsInfo, barsInfo, loungebarsInfo, cinemasInfo
} = require('./data/typesInfo')
const {
    startKeyboard, dosugKeyboard, infoKeyboard,
    foodKeyboard, checkinKeyboard, cultureChillKeyboard,
    entertainmentKeyboard, historyKeyboard, individualsKeyboard,
    cultureKeyboard, holidaysKeyboard
} = require('./data/inlineKeyboards')

const bot = new TelegramBot(process.env.API_KEY, {
    polling: {
        interval: 300,
        autoStart: true
    }
})

function readJsonFile(filePath) {
    const absolutePath = path.resolve(__dirname, 'data', filePath)
    const fileContent = fs.readFileSync(absolutePath, 'utf8')
    return JSON.parse(fileContent)
}

const {
    cafes, restaurants, hotels, hostels, museums, theaters,
    parks, sights, quests, bars, loungebars, cinemas
} = Object.fromEntries(
    ['cafes', 'restaurants', 'hotels', 'hostels', 'museums', 'theaters', 'parks', 'sights', 'quests', 'bars', 'loungebars', 'cinemas']
        .map(key => [key, readJsonFile(`${key}Data.json`)])
)

async function updateCards(ctx, cardType, cardsInfo, cardArray) {
    const card = cardsInfo[ctx.data]
    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    await bot.sendPhoto(ctx.message.chat.id, `./images/${cardType}/${card.image}`, {
        caption: getDescription(card.id, cardArray.filter(c => c.id === card.id)),
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{text: card.buttonText, callback_data: cardType}]
            ],
            resize_keyboard: true
        }
    })
}

async function updateCulture(ctx, url, callBack) {
    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    await bot.sendMessage(ctx.message.chat.id, url, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: '⬅️ Назад', callback_data: `${callBack}`}
                ]
            ]
        }
    })
}

async function setOptions(ctx, message, data, backButtonCallback) {
    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    const inlineKeyboard = data.map(c => [{text: c.name, callback_data: c.id}])
    inlineKeyboard.push([{text: '⬅️ Назад', callback_data: backButtonCallback}])
    await bot.sendMessage(ctx.message.chat.id, message, {
        reply_markup: {
            inline_keyboard: inlineKeyboard,
            resize_keyboard: true
        }
    })
}


bot.on('text', async msg => {
    try {
        if (msg.text === '/start') {
            await bot.sendMessage(msg.chat.id, 'Выберите, что ищем', startKeyboard)
        } else if (msg.text === '/menu') {
            await bot.sendMessage(msg.chat.id, 'Меню', startKeyboard)
        } else if (msg.text === '🧘🏼‍ Досуг') {
            await bot.deleteMessage(msg.chat.id, msg.message_id)
            await bot.sendMessage(msg.chat.id, '🧘🏼‍ Досуг', dosugKeyboard)
        } else if (msg.text === '🏙 Информация о городе') {
            await bot.deleteMessage(msg.chat.id, msg.message_id)
            await bot.sendMessage(msg.chat.id, '🏙 Информация о городе', infoKeyboard)
        } else {
            await bot.sendMessage(msg.chat.id, msg.text)
        }
    } catch (error) {
        console.log(error)
    }
})

bot.on('callback_query', async ctx => {
    try {
        switch (ctx.data) {
            case 'menu_dosug':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, '🧘🏼‍ Досуг', dosugKeyboard)
                break
            case 'menu_info':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, '🏙 Информация о городе', infoKeyboard)
                break

            case 'food':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите покушать', foodKeyboard)
                break
            case 'checkin':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите заселиться', checkinKeyboard)
                break
            case 'culture_chill':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите культурно отдохнуть', cultureChillKeyboard)
                break
            case 'entertainment':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите поразвлекаться', entertainmentKeyboard)
                break

            case 'history':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                const historyUrl = 'https://telegra.ph/Istoriya-Joshkar-Oly-12-26'
                await bot.sendMessage(ctx.message.chat.id, historyUrl, historyKeyboard)
                break
            case 'culture':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, что хотите узнать о культуре', cultureKeyboard)
                break

            case 'cafes':
                await setOptions(ctx, 'Выберите кафе', cafes, 'food')
                break
            case 'restaurants':
                await setOptions(ctx, 'Выберите ресторан', restaurants, 'food')
                break

            case 'hotels':
                await setOptions(ctx, 'Выберите отель', hotels, 'checkin')
                break
            case 'hostels':
                await setOptions(ctx, 'Выберите гостиницу', hostels, 'checkin')
                break

            case 'museums':
                await setOptions(ctx, 'Выберите музей', museums, 'culture_chill')
                break
            case 'theaters':
                await setOptions(ctx, 'Выберите театр', theaters, 'culture_chill')
                break
            case 'parks':
                await setOptions(ctx, 'Выберите парк', parks, 'culture_chill')
                break
            case 'sights':
                await setOptions(ctx, 'Выберите достопримечательность', sights, 'culture_chill')
                break

            case 'quests':
                await setOptions(ctx, 'Выберите квест', quests, 'entertainment')
                break
            case 'bars':
                await setOptions(ctx, 'Выберите бар', bars, 'entertainment')
                break
            case 'loungebars':
                await setOptions(ctx, 'Выберите лаундж бар', loungebars, 'entertainment')
                break
            case 'cinemas':
                await setOptions(ctx, 'Выберите кинотеатр', cinemas, 'entertainment')
                break

            case 'interesting_individuals':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите человека', individualsKeyboard)
                break
            case 'eshpay':
                await updateCulture(ctx, 'https://telegra.ph/YAkov-Andreevich-EHshpaj-12-26', 'interesting_individuals')
                break
            case 'eshkinin':
                await updateCulture(ctx, 'https://telegra.ph/Andrej-Karpovich-EHshkinin-12-26', 'interesting_individuals')
                break
            case 'dmitriev':
                await updateCulture(ctx, 'https://telegra.ph/YUrij-YAkovlevich-Dmitriev-12-26', 'interesting_individuals')
                break

            case 'traditional_holidays':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Традиционные праздники', holidaysKeyboard)
                break

            case 'upuchimish':
                await updateCulture(ctx, 'https://telegra.ph/U-puchymysh-Prazdnik-novoj-kashi-12-27', 'traditional_holidays')
                break
            case 'kugeche':
                await updateCulture(ctx, 'https://telegra.ph/U-puchymysh-Prazdnik-novoj-kashi-12-27', 'traditional_holidays')
                break
            case 'uginde':
                await updateCulture(ctx, 'https://telegra.ph/Uginde-Prazdnik-novogo-hleba-12-27', 'traditional_holidays')
                break
            case 'portsii':
                await updateCulture(ctx, 'https://telegra.ph/P%D3%A7rtsij-novosele-12-27', 'traditional_holidays')
                break
            case 'surem':
                await updateCulture(ctx, 'https://telegra.ph/S%D3%B1rem-Prazdnik-letnego-zhertvoprinosheniya-12-27', 'traditional_holidays')
                break

            case 'close_menu':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                break

            case 'shkaf':
            case 'sangrita':
            case 'frendi':
            case 'malChikago':
                await updateCards(ctx, 'cafes', cafesInfo, cafes)
                break

            case 'monTresor':
            case 'gosti':
            case 'mullerHall':
                await updateCards(ctx, 'restaurants', restaurantsInfo, restaurants)
                break

            case 'firstTrain':
            case 'amaksCityHotel':
            case 'revizor':
            case 'nikitin':
                await updateCards(ctx, 'hotels', hotelsInfo, hotels)
                break

            case 'evrika':
            case 'virginia':
            case 'flatLuxe':
            case 'rgard':
                await updateCards(ctx, 'hostels', hostelsInfo, hostels)
                break

            case 'evseev':
            case 'nationalGallery':
            case 'republicGallery':
            case 'cheese':
                await updateCards(ctx, 'museums', museumsInfo, museums)
                break

            case 'shketan':
            case 'junZritel':
            case 'sapaev':
            case 'kukly':
            case 'konstantinov':
                await updateCards(ctx, 'theaters', theatersInfo, theaters)
                break

            case 'centr':
            case 'pobeda':
            case 'mnogolet':
            case 'sunday':
            case 'sosni':
                await updateCards(ctx, 'parks', parksInfo, parks)
                break

            case 'yokot':
            case 'twelve':
            case 'blagoSobor':
            case 'spASSTower':
            case 'korepovy':
                await updateCards(ctx, 'sights', sightsInfo, sights)
                break

            case 'vihod':
            case 'molchanie':
            case 'vinegret':
                await updateCards(ctx, 'quests', questsInfo, quests)
                break

            case 'buldog':
            case 'theFox':
            case 'dublin':
            case 'pivovar':
            case 'chester':
                await updateCards(ctx, 'bars', barsInfo, bars)
                break

            case 'hookah':
            case 'oblaka':
            case 'edison':
            case 'fenomen':
                await updateCards(ctx, 'loungebars', loungebarsInfo, loungebars)
                break

            case 'super':
            case 'cinemaEl':
            case 'oktyabr':
                await updateCards(ctx, 'cinemas', cinemasInfo, cinemas)
                break
        }
    } catch (error) {
        console.log(error)
    }
})

function getDescription(id, data) {
    const item = data.find(c => c.id === id)
    return (
        `\n<strong>«${item.name}»</strong>\n\n` +
        (item.address ? `📍 <u>Адрес:</u> ${item.address}\n` : '') +
        (item.rating ? `⭐️ <u>Рейтинг:</u> ${item.rating}\n` : '') +
        (item.timetable ? `⏰ <u>График работы:</u>\n${item.timetable}\n` : '') +
        (item.geoPosition ? `\nЯ.Карты: <a href="${item.geoPosition}">посмотреть</a>` : '')
    )
}