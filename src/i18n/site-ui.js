/**
 * Native Backloggd UI strings (English source) → target locale.
 * Exact map keys must match trimmed textContent / attribute values on the site.
 * Only locales with a pack here are applied; Plus chrome uses TRANSLATIONS separately.
 */

/** @typedef {{ exact: Record<string, string>, patterns?: Array<{ re: RegExp, replace: string | ((m: RegExpMatchArray) => string) }> }} SiteUiPack */

/** @type {Record<string, SiteUiPack>} */
export const SITE_UI = {
  ru: {
    exact: {
      // —— Navbar / global ——
      Games: 'Игры',
      Search: 'Поиск',
      'Log a Game': 'Записать игру',
      Home: 'Главная',
      Journal: 'Журнал',
      Activity: 'Активность',
      Lists: 'Списки',
      Reviews: 'Рецензии',
      Users: 'Пользователи',
      Profile: 'Профиль',
      Settings: 'Настройки',
      Logout: 'Выйти',
      'Log Out': 'Выйти',
      'Sign in': 'Войти',
      'Sign up': 'Регистрация',
      'Log in': 'Войти',
      'Log out': 'Выйти',
      'Sign Out': 'Выйти',
      'Sign out': 'Выйти',
      Notifications: 'Уведомления',
      Messages: 'Сообщения',
      Following: 'Подписки',
      Followers: 'Подписчики',
      Follow: 'Подписаться',
      Unfollow: 'Отписаться',
      Block: 'Заблокировать',
      Report: 'Пожаловаться',
      Share: 'Поделиться',
      // Short: pink sidebar button is narrow — "Редактировать" wraps/breaks
      Edit: 'Изменить',
      Delete: 'Удалить',
      Cancel: 'Отмена',
      Save: 'Сохранить',
      Submit: 'Отправить',
      Close: 'Закрыть',
      Back: 'Назад',
      Next: 'Далее',
      Previous: 'Назад',
      More: 'Ещё',
      Less: 'Меньше',
      'Show more': 'Показать ещё',
      'Show less': 'Свернуть',
      'Load more': 'Загрузить ещё',
      'View All': 'Смотреть все',
      'View all': 'Смотреть все',
      'See all': 'Смотреть все',
      All: 'Все',
      None: 'Нет',
      Yes: 'Да',
      No: 'Нет',
      Or: 'или',
      and: 'и',
      of: 'из',
      On: 'Вкл',
      Off: 'Выкл',

      // —— Game page sidebar / actions ——
      // Short labels for narrow pink sidebar button
      'Log or review': 'Отметить',
      'Log or review again': 'Снова',
      'Log again': 'Снова',
      'Review again': 'Снова',
      'Log or Review': 'Отметить',
      Запись: 'Отметить',
      Played: 'Пройдено',
      Playing: 'Играю',
      Backlog: 'Бэклог',
      Backlogs: 'Бэклоги',
      Wishlist: 'Вишлист',
      Wishlists: 'Вишлисты',
      // Short: long label made the lists button huge and shifted the heart
      'Manage lists': 'Списки',
      'Manage Lists': 'Списки',
      'Change cover': 'Сменить обложку',
      'Change Cover': 'Сменить обложку',
      Bundled: 'В бандлах',
      Bundle: 'Бандл',
      Bundles: 'Бандлы',
      Like: 'Нравится',
      Likes: 'Лайки',
      Unlike: 'Убрать лайк',
      'Like this game': 'Нравится эта игра',
      'Unlike this game': 'Убрать «нравится»',
      Myself: 'Я',
      Me: 'Я',
      'Top Liked': 'Топ по лайкам',
      'Nothing here!': 'Пока пусто!',
      'Nothing here': 'Пока пусто',
      'Personal Ratings': 'Личные оценки',
      'Earned Badges': 'Полученные значки',
      Badges: 'Значки',
      'Favorite Games': 'Любимые игры',
      'Favorite games': 'Любимые игры',
      'Games Played': 'Игр пройдено',
      'Games Backloggd': 'В бэклоге',
      'Games Backlogged': 'В бэклоге',
      'Recently Played': 'Недавно играл',
      'Recently Reviewed': 'Недавние рецензии',
      'Open review': 'Открыть рецензию',
      'Open Review': 'Открыть рецензию',
      EXPAND: 'РАЗВЕРНУТЬ',
      Expand: 'Развернуть',
      COLLAPSE: 'СВЕРНУТЬ',
      Collapse: 'Свернуть',
      Comment: 'Комментарий',
      Comments: 'Комментарии',
      Replay: 'Реплей',
      Abandoned: 'Заброшено',
      Retired: 'В отставке',
      Shelved: 'Отложено',
      Finished: 'Пройдено',
      Mastered: 'Мастерство',

      // —— Game meta labels ——
      Released: 'Релиз',
      'Release date': 'Дата релиза',
      Developer: 'Разработчик',
      Developers: 'Разработчики',
      Publisher: 'Издатель',
      Publishers: 'Издатели',
      GENRES: 'ЖАНРЫ',
      Genres: 'Жанры',
      Genre: 'Жанр',
      PLATFORMS: 'ПЛАТФОРМЫ',
      Platforms: 'Платформы',
      Platform: 'Платформа',
      Franchise: 'Франшиза',
      Series: 'Серия',
      Themes: 'Темы',
      Modes: 'Режимы',
      'Game modes': 'Режимы игры',
      'Player perspectives': 'Перспектива',
      by: 'от',

      // —— Stats block (native Backloggd) ——
      'Avg Rating': 'Средняя оценка',
      Plays: 'Прохождения',
      Ratings: 'Оценки',
      average: 'в среднем',
      'to finish': 'до конца',
      'to master': 'до мастерства',
      // Short — fits dropdown; long phrase often fails when split in DOM
      'Stats for all versions': 'Все версии',
      'Stats for this version': 'Эта версия',
      'Stats for all versions ▾': 'Все версии ▾',
      'Stats for all versions ▼': 'Все версии ▼',
      'Stats for all versions ˅': 'Все версии ˅',
      'all versions': 'все версии',
      'this version': 'эта версия',
      // Genres (IGDB labels on game page)
      Adventure: 'Приключения',
      Puzzle: 'Головоломка',
      Shooter: 'Шутер',
      Action: 'Экшен',
      Strategy: 'Стратегия',
      RPG: 'RPG',
      'Role-playing (RPG)': 'RPG',
      Simulator: 'Симулятор',
      Simulation: 'Симулятор',
      Racing: 'Гонки',
      Sport: 'Спорт',
      Sports: 'Спорт',
      Fighting: 'Файтинг',
      Platform: 'Платформер',
      Indie: 'Инди',
      Arcade: 'Аркада',
      Horror: 'Хоррор',
      'Point-and-click': 'Point-and-click',
      'Visual Novel': 'Визуальная новелла',
      Tactical: 'Тактика',
      MOBA: 'MOBA',
      'More info on IGDB': 'Подробнее на IGDB',
      'More info on': 'Подробнее на',
      'More info': 'Подробнее',
      'Based on': 'На основе',
      'Profile Stats': 'Статистика профиля',
      'Game Ratings': 'Оценки игр',
      'Quick Log': 'Быстрая запись',
      'Quick log': 'Быстрая запись',
      'Recently trending': 'Сейчас в тренде',
      'Popular reviews': 'Популярные рецензии',
      'See More': 'Ещё',
      'See more': 'Ещё',
      'Submit feedback': 'Отправить отзыв',
      reviewed: 'рецензия',
      Reviewed: 'Рецензия',
      'Completed on': 'Пройдено на',
      Completed: 'Пройдено',
      'Latest news': 'Новости',
      'See Past Articles': 'Архив',
      'See past articles': 'Архив',
      'Popular lists': 'Популярные списки',
      'Coming soon': 'Скоро',
      'Recently anticipated': 'Ожидаемые',
      'Sleeper hits': 'Скрытые хиты',
      "try shuffle sort when you can't decide what to play!":
        'попробуй shuffle sort, если не знаешь во что поиграть!',
      "try shuffle sort when you can't decide what to play":
        'попробуй shuffle sort, если не знаешь во что поиграть',

      // —— Log / review editor modal ——
      Review: 'Рецензия',
      Details: 'Детали',
      Journal: 'Журнал',
      CURRENT: 'ТЕКУЩИЙ',
      Log: 'Лог',
      'CURRENT Log': 'ТЕКУЩИЙ лог',
      'Mark your log dates': 'Указать даты лога',
      'Select release platform...': 'Выберите платформу…',
      'Select release platform…': 'Выберите платформу…',
      'Select release platform': 'Выберите платформу',
      "What'd you think...": 'Что думаешь…',
      "What'd you think…": 'Что думаешь…',
      'Contains spoilers': 'Есть спойлеры',
      'Use Full Editor': 'Полный редактор',
      'Create Log': 'Создать лог',
      'Update Log': 'Обновить лог',
      'Save Log': 'Сохранить лог',
      Formatting: 'Разметка',
      Platform: 'Платформа',
      'This review contains spoilers': 'В рецензии есть спойлеры',
      "I'm ready": 'Я готов',
      'I am ready': 'Я готов',
      'Hide spoilers': 'Скрыть спойлеры',
      'Show spoilers': 'Показать спойлеры',
      members: 'участников',

      // —— Filters / sort / display (library & lists) ——
      'Apply Filters': 'Применить',
      'Apply filters': 'Применить',
      Filters: 'Фильтры',
      Filter: 'Фильтр',
      Display: 'Вид',
      Sort: 'Сортировка',
      'Sort by': 'Сортировать',
      'Recently Updated': 'Недавно обновлённые',
      'Recently updated': 'Недавно обновлённые',
      'When Added': 'Когда добавлено',
      'Last Played': 'Последний запуск',
      'Time Played': 'Время в игре',
      'User Rating': 'Ваша оценка',
      'Game Rating': 'Оценка игры',
      'Game Title': 'Название',
      Popularity: 'Популярность',
      'Release Date': 'Дата релиза',
      'Avg. Play Time': 'Ср. время игры',
      'Avg. Finish Time': 'Ср. время прохождения',
      Random: 'Случайно',
      'Fade played': 'Приглушать пройденные',
      'Custom covers': 'Свои обложки',
      'Any cover': 'Любые обложки',
      'Your covers': 'Ваши обложки',
      'No covers': 'Без обложек',
      'Create List': 'Создать список',
      'Create Folder': 'Создать папку',
      'New List': 'Новый список',
      'New Folder': 'Новая папка',
      Folder: 'Папка',
      Folders: 'Папки',

      // —— Activity feed ——
      'Recent Activity': 'Недавняя активность',
      'No recent activity': 'Нет недавней активности',
      'Filter Activities': 'Фильтр активности',
      'Filter activities': 'Фильтр активности',
      Showing: 'Показано',
      "Friends' Activity": 'Активность друзей',
      "Friends' activity": 'Активность друзей',
      'Your Activity': 'Ваша активность',
      'Your activity': 'Ваша активность',
      'Inbound Activity': 'Входящая активность',
      'Inbound activity': 'Входящая активность',
      Follows: 'Подписки',
      Followers: 'Подписчики',
      'GuessThe.Game': 'GuessThe.Game',
      'Backer Upgrade': 'Апгрейд Backer',
      'View up to 60 days of activities when you become a backer':
        'До 60 дней активности, если станете backer',
      'become a backer': 'стать backer',

      // —— Profile ——
      'Edit Profile': 'Редактировать профиль',
      'Edit profile': 'Редактировать профиль',

      // —— Pagination ——
      Prev: 'Назад',
      '‹ Prev': '‹ Назад',
      '< Prev': '< Назад',
      'Next ›': 'Далее ›',
      'Next >': 'Далее >',
      Previous: 'Назад',
      First: 'Первая',
      Last: 'Последняя',
      Page: 'Страница',
      Member: 'Участник',
      Members: 'Участники',

      // —— Related / editions tabs ——
      'Related Games': 'Связанные игры',
      DLC: 'DLC',
      Updates: 'Обновления',
      Editions: 'Издания',
      'In Bundles': 'В бандлах',
      Remaster: 'Ремастер',
      Remake: 'Ремейк',
      Port: 'Порт',
      Expansion: 'Дополнение',
      Season: 'Сезон',
      Episode: 'Эпизод',

      // —— Reviews filters ——
      Latest: 'Новые',
      Popular: 'Популярные',
      Everyone: 'Все',
      Friends: 'Друзья',
      'All Editions': 'Все издания',
      'This Edition': 'Это издание',
      'Write a review': 'Написать рецензию',
      'No reviews yet': 'Пока нет рецензий',
      'No reviews': 'Нет рецензий',
      Spoiler: 'Спойлер',
      Spoilers: 'Спойлеры',
      Contains: 'Содержит',
      'Read more': 'Читать далее',
      'Full review': 'Полная рецензия',

      // —— Logging / status ——
      Status: 'Статус',
      Rating: 'Оценка',
      'Date started': 'Дата начала',
      'Date finished': 'Дата прохождения',
      'Hours played': 'Часов сыграно',
      Notes: 'Заметки',
      Private: 'Приватно',
      Public: 'Публично',
      'Is this a replay?': 'Это повторное прохождение?',
      'Add to lists': 'Добавить в списки',
      'Remove from list': 'Убрать из списка',
      'Create a list': 'Создать список',
      'New list': 'Новый список',
      Description: 'Описание',
      Ranked: 'Ранжированный',
      Ordered: 'Упорядоченный',
      Grid: 'Сетка',
      'List view': 'Список',

      // —— Search / discover ——
      Discover: 'Обзор',
      Upcoming: 'Скоро',
      Recent: 'Недавние',
      Trending: 'В тренде',
      'Top Rated': 'Лучшие',
      Filters: 'Фильтры',
      Filter: 'Фильтр',
      Sort: 'Сортировка',
      'Sort by': 'Сортировать',
      Order: 'Порядок',
      Ascending: 'По возрастанию',
      Descending: 'По убыванию',
      Apply: 'Применить',
      Reset: 'Сбросить',
      Clear: 'Очистить',
      Results: 'Результаты',
      'No results': 'Ничего не найдено',
      'No games found': 'Игры не найдены',
      Decade: 'Десятилетие',
      'Release year': 'Год релиза',

      // —— Profile / social ——
      Bio: 'О себе',
      Location: 'Местоположение',
      Joined: 'Регистрация',
      Favorite: 'Избранное',
      Favorites: 'Избранное',
      'Favorite games': 'Любимые игры',
      Diary: 'Дневник',
      Stats: 'Статистика',
      Overview: 'Обзор',
      Library: 'Библиотека',
      Collection: 'Коллекция',
      Hours: 'Часы',

      // —— Misc chrome ——
      About: 'О сайте',
      FAQ: 'FAQ',
      Help: 'Помощь',
      Contact: 'Контакты',
      Privacy: 'Конфиденциальность',
      Terms: 'Условия',
      Donate: 'Поддержать',
      Premium: 'Premium',
      Pro: 'Pro',
      Free: 'Бесплатно',
      Loading: 'Загрузка…',
      Error: 'Ошибка',
      Success: 'Готово',
      'Something went wrong': 'Что-то пошло не так',
      'Try again': 'Попробовать снова',
      Confirm: 'Подтвердить',
      'Are you sure?': 'Вы уверены?',
      Optional: 'Необязательно',
      Required: 'Обязательно',
      'Select…': 'Выберите…',
      'Select...': 'Выберите…',
      Unknown: 'Неизвестно',
      TBA: 'TBA',
      TBD: 'TBD',
      'N/A': 'Н/Д',

      // —— Time-ish labels that appear alone ——
      Today: 'Сегодня',
      Yesterday: 'Вчера',
      Tomorrow: 'Завтра',
      Week: 'Неделя',
      Month: 'Месяц',
      Year: 'Год',
      Just: 'Только что',
      now: 'сейчас',
      ago: 'назад',

      // —— Empty / helper ——
      'No games': 'Нет игр',
      'No lists': 'Нет списков',
      'No activity': 'Нет активности',
      'Nothing here yet': 'Пока пусто',
      'Add games': 'Добавить игры',
      'Search games': 'Поиск игр',
      'Search users': 'Поиск пользователей',
      Username: 'Имя пользователя',
      Password: 'Пароль',
      Email: 'Email',
      Name: 'Имя',
      Title: 'Название',

      // —— Buttons that appear as full control labels ——
      'Log game': 'Записать игру',
      'Quick log': 'Быстрая запись',
      Update: 'Обновить',
      Remove: 'Удалить',
      Add: 'Добавить',
      Create: 'Создать',
      Done: 'Готово',
      Continue: 'Продолжить',
      Skip: 'Пропустить',
      Open: 'Открыть',
      Copy: 'Копировать',
      Copied: 'Скопировано',
      Download: 'Скачать',
      Upload: 'Загрузить',
      Preview: 'Превью',
      Publish: 'Опубликовать',
      Draft: 'Черновик',
      Pin: 'Закрепить',
      Unpin: 'Открепить',
      Hide: 'Скрыть',
      Show: 'Показать',

      // —— Settings (/settings) sidebar ——
      Defaults: 'По умолчанию',
      'Set your defaults across the site': 'Значения по умолчанию на всём сайте',
      'Customize your avatar and profile': 'Аватар и профиль',
      'Customize how you\'re notified': 'Как приходят уведомления',
      "Customize how you're notified": 'Как приходят уведомления',
      Backer: 'Backer',
      'Connect your Patreon account': 'Подключить аккаунт Patreon',
      Data: 'Данные',
      'Manage your Backloggd data': 'Управление данными Backloggd',
      Account: 'Аккаунт',
      'Update your email / password': 'Email и пароль',
      Integrations: 'Интеграции',
      'Hook into external sites / apps': 'Внешние сайты и приложения',
      Archive: 'Архив',
      'Cleanup lost game logs': 'Очистка потерянных записей',
      'Blocked Users': 'Заблокированные',
      'Manage blocked users': 'Управление блокировками',
      Infractions: 'Нарушения',
      "View your account's status": 'Статус аккаунта',
      'View your account\'s status': 'Статус аккаунта',

      // —— Settings → Profile ——
      'You may change your username once every 30 days':
        'Имя пользователя можно менять раз в 30 дней',
      Change: 'Изменить',
      Biography: 'Биография',
      'Write a bio': 'Напишите о себе',
      'Social links': 'Соцсети',
      'Choose a social link': 'Выберите соцсеть',
      'Reorder your favorites by dragging the covers':
        'Перетащите обложки, чтобы изменить порядок избранного',
      Features: 'Функции',
      'Custom Covers': 'Свои обложки',
      'Choose which custom covers to display throughout the site':
        'Какие пользовательские обложки показывать на сайте',
      'Default: Any cover': 'По умолчанию: любые обложки',
      'Any cover': 'Любые обложки',
      'Любые обложки': 'Любые обложки',
      'Prefer yours': 'Предпочитать ваши',
      'No custom covers': 'Без своих обложек',
      'Home Widgets': 'Виджеты на главной',
      'Display widgets at the top of your home page':
        'Виджеты вверху главной страницы',
      Enable: 'Включить',
      Disable: 'Выключить',
      'Higher Contrast': 'Больше контраста',
      'Pink coloring is displayed lighter': 'Розовый цвет отображается светлее',
      'Display Playtimes': 'Показывать время игры',
      "Show average playtimes on a game's page":
        'Среднее время прохождения на странице игры',
      'Show average playtimes on a game\'s page':
        'Среднее время прохождения на странице игры',
      'Always show': 'Всегда показывать',
      'Show after played': 'После «Пройдено»',
      'Hide behind toggle': 'Скрыть за переключателем',
      'Content filtering': 'Фильтр контента',
      'Display erotic adult games': 'Показывать эротические/взрослые игры',
      'Backloggd will never serve explicit content directly.':
        'Backloggd никогда не показывает explicit-контент напрямую.',
      'Search and browse': 'Поиск и просмотр',
      'Discovery Engine': 'Рекомендации',
      'Save changes': 'Сохранить',
      'Save Changes': 'Сохранить',

      // —— Settings → Defaults ——
      'Your Profile': 'Ваш профиль',
      'Played sort': 'Сортировка «Пройдено»',
      'Playing sort': 'Сортировка «Играю»',
      'Backlog sort': 'Сортировка бэклога',
      'Wishlist sort': 'Сортировка вишлиста',
      'Game likes sort': 'Сортировка лайков игр',
      'Lists sort': 'Сортировка списков',
      'GOTY Lists sort': 'Сортировка списков GOTY',
      'Journal view': 'Вид журнала',
      'When Liked': 'Когда лайкнуто',
      'When liked': 'Когда лайкнуто',
      'All sessions': 'Все сессии',
      'Browse sort': 'Сортировка обзора',
      'Game page sort': 'Сортировка на странице игры',
      'Default: Latest': 'По умолчанию: новые',
      Latest: 'Новые',
      'Log Editor': 'Редактор записи',
      'Played status': 'Статус «Пройдено»',
      'Behavior upon first play session': 'При первой игровой сессии',
      'Do nothing': 'Ничего не делать',
      'Playtime sync setting': 'Синхронизация времени игры',
      "Don't sync": 'Не синхронизировать',
      'Don\'t sync': 'Не синхронизировать',
      'Privacy Settings': 'Приватность',
      'Journal note privacy': 'Приватность заметок журнала',
      'Review / list comment privacy': 'Приватность комментариев к рецензиям и спискам',
      'Anyone can view': 'Все могут смотреть',
      'Anyone can comment': 'Все могут комментировать',
      'Only friends can view': 'Только друзья',
      'Only I can view': 'Только я',
      'Default privacy': 'Приватность по умолчанию',
      ASC: 'ASC',
      DESC: 'DESC',

      // —— Settings → Notifications ——
      'Who can mention you in a comment': 'Кто может упоминать вас в комментариях',
      'Who can send a like notification for reviews':
        'Кто шлёт уведомления о лайках рецензий',
      'Who can send a like notification for lists':
        'Кто шлёт уведомления о лайках списков',
      'Default: Anyone': 'По умолчанию: все',
      Anyone: 'Все',
      'Only friends': 'Только друзья',
      Nobody: 'Никто',

      // —— Settings → Backer / Patreon ——
      'Backer Perks': 'Привилегии Backer',
      'Connect an active Patreon account to receive your in-site perks.':
        'Подключите активный Patreon, чтобы получать привилегии на сайте.',
      'Connect Patreon account': 'Подключить Patreon',
      'Not on Patreon? Check out all these cool perks you can get by signing up!':
        'Ещё не на Patreon? Вот привилегии, которые можно получить:',
      'Unlimited game logging': 'Неограниченные записи игр',
      'Unlimited list creation': 'Неограниченные списки',
      'Unlimited reviews': 'Неограниченные рецензии',
      'Unlimited journal tracking': 'Неограниченный журнал',
      '14-days of recent activity': '14 дней недавней активности',
      'Continuous access to new features / updates':
        'Постоянный доступ к новым функциям и обновлениям',
      'Personalized all-time stats page': 'Персональная страница статистики за всё время',
      'Yearly detailed stats recap': 'Годовой подробный отчёт статистики',
      'Ad-free experience': 'Без рекламы',
      'Home page widget customization': 'Настройка виджетов главной',
      '60-days of recent activity': '60 дней недавней активности',
      'First-look previews through Patreon': 'Превью новинок через Patreon',
      'Early beta feature access': 'Ранний доступ к бета-функциям',
      'Exclusive Discord channel / role': 'Закрытый канал / роль в Discord',
      'With more being added!': 'И это ещё не всё!',
      '$3 / month via Patreon': '$3 / месяц через Patreon',

      // —— Settings → Data ——
      'Data Management': 'Управление данными',
      'Manage your logging data.': 'Управление данными записей.',
      'Reset journal note privacy': 'Сбросить приватность заметок журнала',
      'Override and reset all journal note privacies to a single privacy setting.':
        'Сбросить приватность всех заметок журнала к одному значению.',
      'Remove all tags': 'Удалить все теги',
      'Remove all tags from every journal play session.':
        'Удалить теги со всех игровых сессий журнала.',
      'Remove all ratings': 'Удалить все оценки',
      'Reset all ratings on every log you have.':
        'Сбросить оценки со всех ваших записей.',
      'Remove ratings': 'Удалить оценки',
      'Delete All Logs': 'Удалить все записи',
      'Delete all logs': 'Удалить все записи',

      // —— Settings → Account ——
      'New Password': 'Новый пароль',
      "Leave blank if you don't want to change it":
        'Оставьте пустым, если не хотите менять',
      'Leave blank if you don\'t want to change it':
        'Оставьте пустым, если не хотите менять',
      'Confirm New Password': 'Подтвердите новый пароль',
      'Current Password': 'Текущий пароль',
      'Deactivate Account': 'Деактивировать аккаунт',
      'Deactivate account': 'Деактивировать аккаунт',
      'Permanently Delete Account': 'Удалить аккаунт навсегда',
      'Permanently delete account': 'Удалить аккаунт навсегда',

      // —— Settings → Integrations ——
      'User UUID': 'UUID пользователя',
      'Visit https://guessthe.game for your UUID':
        'UUID: https://guessthe.game (внизу настроек)',
      'Create activity upon win or loss': 'Активность при победе или поражении',
      'Exclusive GuessThe.Game stats widget': 'Виджет статистики GuessThe.Game',
      'Automatic daily guess activity': 'Ежедневная активность угадывания',
    },
    patterns: [
      // Settings — long help / legal paragraphs (site walker length-caps)
      {
        re: /^Delete all your logs but retain your account to start fresh[\s\S]*$/i,
        replace:
          'Удалит все записи, но сохранит аккаунт. Пропадут логи, журнал, библиотека и рецензии. Останутся бейджи, имя, списки, друзья и лайки. Действие необратимо.',
      },
      {
        re: /^This will lock your account, log you out[\s\S]*$/i,
        replace:
          'Аккаунт будет заблокирован, вы выйдете из системы, активность исчезнет, профиль станет невидимым. Имя может стать доступным другим. Восстановление — по ссылке реактивации или через поддержку.',
      },
      {
        re: /^This will remove your account with all of its associated data[\s\S]*$/i,
        replace:
          'Аккаунт и все связанные данные будут удалены из базы навсегда. После удаления восстановление невозможно.',
      },
      {
        re: /^Connect your GuessThe\.Game account by going to settings[\s\S]*$/i,
        replace:
          'Подключите GuessThe.Game: откройте настройки на guessthe.game, скопируйте UUID внизу и сохраните здесь — виджет статистики и ежедневная активность угадывания.',
      },
      {
        re: /^Badge\s+BACKER\s+next to your username$/i,
        replace: 'Бейдж BACKER рядом с именем',
      },
      {
        re: /^Вид\s+BACKER\s+next to your username$/i,
        replace: 'Бейдж BACKER рядом с именем',
      },
      {
        re: /^Default:\s*(.+)$/i,
        replace: (m, rest) => {
          const map = {
            'Any cover': 'Любые обложки',
            Latest: 'Новые',
            Anyone: 'Все',
          };
          const r = String(rest || '').trim();
          return `По умолчанию: ${map[r] || r}`;
        },
      },
      // "16h average" / "16 h average"
      {
        re: /^(\d+(?:[.,]\d+)?)\s*h\s+average$/i,
        replace: (_, n) => `${n} ч в среднем`,
      },
      {
        re: /^(\d+(?:[.,]\d+)?)\s*h\s+to finish$/i,
        replace: (_, n) => `${n} ч до конца`,
      },
      {
        re: /^(\d+(?:[.,]\d+)?)\s*h\s+to master$/i,
        replace: (_, n) => `${n} ч до мастерства`,
      },
      // "Stats for all versions" + optional caret / chevron variants
      {
        re: /^Stats\s+for\s+all\s+versions\s*([▾▼˅∨vVˆ^<>‹›]*)$/i,
        replace: (m, caret) => `Все версии${caret ? ` ${caret}` : ''}`.trim(),
      },
      {
        re: /^Stats\s+for\s+this\s+version\s*([▾▼˅∨vVˆ^<>‹›]*)$/i,
        replace: (m, caret) => `Эта версия${caret ? ` ${caret}` : ''}`.trim(),
      },
      {
        re: /^Stats\s+for\s+all\s+versions/i,
        replace: () => 'Все версии',
      },
      {
        re: /^Stats\s+for\b/i,
        replace: () => 'Статистика',
      },
      // "50K Plays" style sometimes split; full phrase if present
      {
        re: /^Based on (\d[\d,]*) ratings?$/i,
        replace: (_, n) => `На основе ${n} оценок`,
      },
      {
        re: /^(\d+)\s+games?$/i,
        replace: (_, n) => {
          const k = Number(n);
          const word =
            k % 10 === 1 && k % 100 !== 11
              ? 'игра'
              : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 10 || k % 100 >= 20)
                ? 'игры'
                : 'игр';
          return `${n} ${word}`;
        },
      },
      {
        re: /^Joined (.+)$/i,
        replace: (_, d) => `Регистрация ${d}`,
      },
      {
        re: /^Released (.+)$/i,
        replace: (_, d) => `Релиз ${d}`,
      },
      // View my 'Game Title' stats →
      {
        re: /^View my ['‘’"](.+?)['‘’"]\s*stats\s*([→›»]?)\s*$/i,
        replace: (_, title, arrow) =>
          `Моя статистика по «${title}»${arrow ? ` ${arrow}` : ''}`.trim(),
      },
      {
        re: /^View my (.+?) stats\s*([→›»]?)\s*$/i,
        replace: (_, title, arrow) =>
          `Моя статистика по «${title.replace(/^['‘’"]|['‘’"]$/g, '')}»${arrow ? ` ${arrow}` : ''}`.trim(),
      },
      // Played in 2026
      {
        re: /^Played in (\d{4})$/i,
        replace: (_, y) => `Сыграно в ${y}`,
      },
      // 0 Likes / 12 Likes
      {
        re: /^(\d+)\s+Likes?$/i,
        replace: (m, n) => {
          const k = Number(n);
          const word =
            k % 10 === 1 && k % 100 !== 11
              ? 'лайк'
              : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 10 || k % 100 >= 20)
                ? 'лайка'
                : 'лайков';
          return `${n} ${word}`;
        },
      },
      // Completed on Windows PC
      {
        re: /^Completed on (.+)$/i,
        replace: (m, platform) => `Пройдено на ${platform}`,
      },
      // Welcome back X, try shuffle...
      {
        re: /^Welcome back\s*(.*?),\s*try shuffle sort when you can't decide what to play!$/i,
        replace: (m, mid) =>
          `С возвращением${mid ? ` ${mid.trim()}` : ''}, попробуй shuffle sort, если не знаешь во что поиграть!`,
      },
      {
        re: /^Welcome back\b/i,
        replace: () => 'С возвращением',
      },
      {
        re: /^,?\s*try shuffle sort when you can't decide what to play!?\s*$/i,
        replace: () => 'попробуй shuffle sort, если не знаешь во что поиграть!',
      },
      {
        re: /try shuffle sort when you can't decide what to play!?/i,
        replace: () => 'попробуй shuffle sort, если не знаешь во что поиграть!',
      },
      // "4 reviewed" style journal line prefix
      {
        re: /^(\d+)\s+reviewed\b/i,
        replace: (m, n) => `${n} · рецензия`,
      },
      // 0 Lists / 12 Lists
      {
        re: /^(\d+)\s+Lists?$/i,
        replace: (m, n) => {
          const k = Number(n);
          const word =
            k % 10 === 1 && k % 100 !== 11
              ? 'список'
              : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 10 || k % 100 >= 20)
                ? 'списка'
                : 'списков';
          return `${n} ${word}`;
        },
      },
      // Showing Friends' Activity
      {
        re: /^Showing\s+(.+)$/i,
        replace: (m, rest) => {
          const map = {
            "Friends' Activity": 'Активность друзей',
            "Friends' activity": 'Активность друзей',
            'Your Activity': 'Ваша активность',
            'Your activity': 'Ваша активность',
            'Inbound Activity': 'Входящая активность',
            'Inbound activity': 'Входящая активность',
          };
          const r = String(rest).trim();
          return `Показано: ${map[r] || r}`;
        },
      },
      // Pagination with arrows glued
      {
        re: /^[‹<]\s*Prev$/i,
        replace: () => '‹ Назад',
      },
      {
        re: /^Next\s*[›>]$/i,
        replace: () => 'Далее ›',
      },
    ],
  },
};

/**
 * @param {string} locale
 * @returns {SiteUiPack | null}
 */
export function getSiteUiPack(locale) {
  if (!locale || locale === 'en') return null;
  return SITE_UI[locale] || null;
}
