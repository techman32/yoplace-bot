const startKeyboard = {
    reply_markup: {
        keyboard: [
            ['🧘🏼‍ Досуг'],
            ['🏙 Информация о городе']
        ],
        resize_keyboard: true
    }
}

const dosugKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Где поесть', callback_data: 'food' },
                { text: 'Где заселиться', callback_data: 'checkin' }
            ],
            [
                { text: 'Культурный отдых', callback_data: 'culture_chill' },
                { text: 'Развлечения', callback_data: 'entertainment' }
            ]
        ]
    }
}

const infoKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'История города', callback_data: 'history' },
                { text: 'Культура', callback_data: 'culture' }
            ]
        ]
    }
}

const foodKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: 'Кафе', callback_data: 'cafes'},
                {text: 'Рестораны', callback_data: 'restaurants'}
            ],
            [
                {text: 'Назад', callback_data: 'menu_dosug'}
            ]
        ]
    }
}

const checkinKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: 'Отели', callback_data: 'hotels'},
                {text: 'Гостиницы', callback_data: 'hostels'}
            ],
            [
                {text: 'Назад', callback_data: 'menu_dosug'}
            ]
        ]
    }
}

const cultureChillKeyboard = {
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
        ]
    }
}

const entertainmentKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: 'Квесты', callback_data: 'quests'},
                {text: 'Бары', callback_data: 'bars'},
            ],
            [
                {text: 'Лаунж бары', callback_data: 'loungebars'},
                {text: 'Кинотеатры', callback_data: 'cinemas'}
            ],
            [
                {text: 'Назад', callback_data: 'menu_dosug'}
            ]
        ]
    }
}

const historyKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Назад', callback_data: 'menu_info' }
            ]
        ]
    }
}

module.exports = {startKeyboard, dosugKeyboard, infoKeyboard, foodKeyboard, checkinKeyboard, cultureChillKeyboard, entertainmentKeyboard, historyKeyboard}