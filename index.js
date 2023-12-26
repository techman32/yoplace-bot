const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '6258476561:AAG7aPEaNztlrEmxDaPTsb8xO_l8oQKlF_Q'

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true
    }
});

const cafe = [
    {
        type: 'cafe_',
        id: 'shkaf',
        name: 'ШКАФ',
        rating: '4,7',
        address: 'Бульвар Чайвана, 32',
        geoPosition: '56.634934, 47.898716',
        timetable: 'Ежедневно c 08:00 до 22:00'
    },
    {
        type: 'cafe_',
        id: 'sangrita',
        name: 'Сангрита',
        rating: '4,9',
        address: 'Бульвар Чайвана, 36',
        geoPosition: '56.635203, 47.897201',
        timetable: 'Ежедневно с 12:00 до 23:00'
    }
]

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
                        ],
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
            await bot.sendMessage(msg.chat.id, msg.text);
        }
    } catch (error) {
        console.log(error)
    }
})

bot.on('callback_query', async ctx => {
    console.log(cafe.map(c => c.id))
    try {
        switch (ctx.data) {
            case 'food':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите покушать', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Кафе', callback_data: 'cafe'},
                                {text: 'Рестораны', callback_data: 'restaurants'}
                            ],
                        ],
                        resize_keyboard: true
                    }
                })
                break;
            case 'checkin':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите, где хотите заселиться', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Отели', callback_data: 'hotels'},
                                {text: 'Гостиницы', callback_data: 'hostels'}
                            ],
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
                                {text: 'Достопримечательности', callback_data: 'attractions'}
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
            case 'cafe':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Выберите кафе', {
                    reply_markup: {
                        inline_keyboard: cafe.map(c => [{
                            text: c.name, callback_data: c.id
                        }]),
                        resize_keyboard: true
                    }
                })
                break
            case 'restaurants':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать рестораны')
                break
            case 'hotels':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать отели')
                break
            case 'hostels':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать гостиницы')
                break
            case 'museums':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать музеи')
                break
            case 'theaters':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать театры')
                break
            case 'parks':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать парки')
                break
            case 'attractions':
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendMessage(ctx.message.chat.id, 'Показать достопримечательности')
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
            case cafe.filter(c => c.id):
                const data = cafe.filter(c => c.id === ctx.data)
                await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
                await bot.sendPhoto(ctx.message.chat.id, './images/cafe/shkaf.jpg', {
                    caption: `\n${data.map(c => c.name)}\nАдрес: ${data.map(c => c.address)}\nРейтинг: ${data.map(c => c.rating)}\nМестоположение: ${data.map(c => c.geoPosition)}\nГрафик работы: ${data.map(c => c.timetable)}`,
                    parse_mode: 'HTML',
                })
                console.log(ctx)
                break
        }
    } catch (error) {
        console.log(error);
    }
})