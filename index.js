const fs = require('fs')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')
const {
        hotelsInfo,
        hostelsInfo,
        restaurantsInfo,
        cafesInfo,
        museumsInfo,
        theatersInfo,
        parksInfo,
        sightsInfo,
      } = require('./data/typesInfo')
const TOKEN = '6258476561:AAG7aPEaNztlrEmxDaPTsb8xO_l8oQKlF_Q'

const bot = new TelegramBot(TOKEN, {
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

const cafes = readJsonFile('cafesData.json')
const restaurants = readJsonFile('restaurantsData.json')
const hotels = readJsonFile('hotelsData.json')
const hostels = readJsonFile('hostelsData.json')
const museums = readJsonFile('museumsData.json')
const theaters = readJsonFile('theatersData.json')
const parks = readJsonFile('parksData.json')
const sights = readJsonFile('sightsData.json')

async function updateCards(ctx, cardType, cardsInfo, cardArray) {
    const card = cardsInfo[ctx.data]
    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    await bot.sendPhoto(ctx.message.chat.id, `./images/${cardType}/${card.image}`, {
        caption: getDescription(card.id, cardArray.filter(c => c.id === card.id)),
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: card.buttonText, callback_data: cardType }]
            ],
            resize_keyboard: true
        }
    })
}

async function setOptions(ctx, message, data, backButtonCallback) {
    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
    const inlineKeyboard = data.map(c => [{ text: c.name, callback_data: c.id }])
    inlineKeyboard.push([{ text: 'Назад', callback_data: backButtonCallback }])
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
            await bot.sendMessage(msg.chat.id, 'Выберите, что ищем', {
                reply_markup: {
                    keyboard: [
                        ['🧘🏼‍ Досуг'],
                        ['🏙 Информация о городе']
                    ],
                    resize_keyboard: true
                }
            })
        } else if (msg.text === '/menu') {
            await bot.sendMessage(msg.chat.id, 'Меню', {
                reply_markup: {
                    keyboard: [
                        ['🧘🏼‍ Досуг'],
                        ['🏙 Информация о городе']
                    ],
                    resize_keyboard: true
                }
            })
        } else if (msg.text === '🧘🏼‍ Досуг') {
            await bot.sendMessage(msg.chat.id, '🧘🏼‍ Досуг', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Где поесть', callback_data: 'food'},
                            {text: 'Где заселиться', callback_data: 'checkin'}
                        ],
                        [
                            {text: 'Культурный отдых', callback_data: 'culture_chill'},
                            {text: 'Развлечения', callback_data: 'entertainment'}
                        ]
                    ]
                }
            })
        } else if (msg.text === '🏙 Информация о городе') {
            await bot.sendMessage(msg.chat.id, '🏙 Информация о городе', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'История города', callback_data: 'history'},
                            {text: 'Культура', callback_data: 'culture'}
                        ]
                    ]
                }
            })
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
                await bot.sendMessage(ctx.message.chat.id, '🧘🏼‍ Досуг', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Где поесть', callback_data: 'food' },
                                { text: 'Где заселиться', callback_data: 'checkin' }
                            ],
                            [
                                { text: 'Культурный отдых', callback_data: 'culture_chill' },
                                { text: 'Развлечения', callback_data: 'entertainment' }
                            ],
                        ]
                    }
                })
                break
            case 'menu_info':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(msg.chat.id, '🏙 Информация о городе', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'История города', callback_data: 'history'},
                                {text: 'Культура', callback_data: 'culture'}
                            ]
                        ]
                    }
                })
                break
            case 'food':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите покушать', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Кафе', callback_data: 'cafes'},
                                {text: 'Рестораны', callback_data: 'restaurants'}
                            ],
                            [
                                {text: 'Назад', callback_data: 'menu_dosug'}
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
                break
            case 'checkin':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите заселиться', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Отели', callback_data: 'hotels'},
                                {text: 'Гостиницы', callback_data: 'hostels'}
                            ],
                            [
                                {text: 'Назад', callback_data: 'menu_dosug'}
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
                break
            case 'culture_chill':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите культурно отдохнуть', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Музеи', callback_data: 'museums'},
                                {text: 'Театры', callback_data: 'theaters'},
                                {text: 'Парки', callback_data: 'parks'},
                            ],
                            [
                                {text: 'Достопримечательности', callback_data: 'sights'}
                            ],
                            [
                                {text: 'Назад', callback_data: 'menu_dosug'}
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
                break
            case 'entertainment':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите поразвлекаться', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Квесты', callback_data: 'quests'},
                                {text: 'Бары', callback_data: 'bars'},
                            ],
                            [
                                {text: 'Лаунж бары', callback_data: 'loungebars'},
                                {text: 'Кинотеатры', callback_data: 'cinema'}
                            ],
                            [
                                {text: 'Назад', callback_data: 'menu_dosug'}
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
                break
            case 'history':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Интересная информаци об истории города')
                break
            case 'culture':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, что хотите узнать о культуре', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Интересные личности', callback_data: 'interesting_individuals'},
                            ],
                            [
                                {text: 'Традиционные праздники', callback_data: 'traditional_holidays'},
                            ]
                        ],
                        resize_keyboard: true
                    }
                })
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
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать квесты')
                break
            case 'bars':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать бары')
                break
            case 'loungebars':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать лаунж бары')
                break
            case 'cinema':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать кинотеатры')
                break

            case 'interesting_individuals':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать интересных личностей')
                break
            case 'traditional_holidays':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать традиционные праздники')
                break

            //cafes
            case 'shkaf':
            case 'sangrita':
            case 'frendi':
            case 'malChikago':
                await updateCards(ctx, 'cafes', cafesInfo, cafes)
                break

            //restaurants
            case 'monTresor':
            case 'gosti':
            case 'mullerHall':
                await updateCards(ctx, 'restaurants', restaurantsInfo, restaurants)
                break

            //hotels
            case 'firstTrain':
            case 'amaksCityHotel':
            case 'revizor':
            case 'nikitin':
                await updateCards(ctx, 'hotels', hotelsInfo, hotels)
                break

            //hostels
            case 'evrika':
            case 'virginia':
            case 'flatLuxe':
            case 'rgard':
                await updateCards(ctx, 'hostels', hostelsInfo, hostels)
                break

            //museums
            case 'evseev':
            case 'nationalGallery':
            case 'republicGallery':
            case 'cheese':
                await updateCards(ctx, 'museums', museumsInfo, museums)
                break

            //theaters
            case 'shketan':
            case 'junZritel':
            case 'sapaev':
            case 'kukly':
            case 'konstantinov':
                await updateCards(ctx, 'theaters', theatersInfo, theaters)
                break

            //parks
            case 'centr':
            case 'pobeda':
            case 'mnogolet':
            case 'sunday':
            case 'sosni':
                await updateCards(ctx, 'parks', parksInfo, parks)
                break

            //sights
            case 'yokot':
            case 'twelve':
            case 'blagoSobor':
            case 'spASSTower':
            case 'korepovy':
                await updateCards(ctx, 'sights', sightsInfo, sights)
        }
    } catch (error) {
        console.log(error)
    }
})

function getDescription(id, data) {
    const item = data.find(c => c.id === id)
    return (
        `\n<strong>«${item.name}»</strong>\n` +
        (item.address ? `📍 <u>Адрес:</u> ${item.address}\n` : '') +
        (item.rating ? `⭐️ <u>Рейтинг:</u> ${item.rating}\n` : '') +
        (item.timetable ? `⏰ <u>График работы:</u>\n${item.timetable}\n` : '') +
        (item.geoPosition ? `Я.Карты: <a href="${item.geoPosition}">посмотреть</a>` : '')
    )
}