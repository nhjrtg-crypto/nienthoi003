export interface PoetItem {
  day: number;
  author: string;
  theme?: string;
  lines: string[];
}

/**
 * Trọn bộ 31 bài thơ trong kho Quote (Daily Poems):
 * Kết hợp hài hòa giữa các tác phẩm kinh điển về KIÊN CƯỜNG, HY VỌNG, NIỀM TIN
 * và sự gắn kết linh hồn son sắt, thuần khiết, không chứa đại từ thiên lệch.
 */
export const poetList: PoetItem[] = [
  {
    day: 1,
    author: 'WILLIAM ERNEST HENLEY',
    theme: 'Kiên cường',
    lines: [
      'Out of the night that covers me,',
      'Black as the pit from pole to pole,',
      'I thank whatever gods may be',
      'For my unconquerable soul.',
    ],
  },
  {
    day: 2,
    author: 'EMILY DICKINSON',
    theme: 'Hy vọng',
    lines: [
      '“Hope” is the thing with feathers -',
      'That perches in the soul -',
      'And sings the tune without the words -',
      'And never stops - at all.',
    ],
  },
  {
    day: 3,
    author: 'MAYA ANGELOU',
    theme: 'Kiên cường & Vươn lên',
    lines: [
      'You may write me down in history',
      'With your bitter, twisted lies,',
      'You may trod me in the very dirt',
      'But still, like dust, I’ll rise.',
    ],
  },
  {
    day: 4,
    author: 'E. E. CUMMINGS',
    theme: 'Gắn kết linh hồn',
    lines: [
      'i carry your heart with me (i carry it in',
      'my heart) i am never without it',
      'here is the deepest secret nobody knows',
      'i carry your heart (i carry it in my heart).',
    ],
  },
  {
    day: 5,
    author: 'LANGSTON HUGHES',
    theme: 'Hy vọng & Giấc mơ',
    lines: [
      'Hold fast to dreams,',
      'For if dreams die,',
      'Life is a broken-winged bird',
      'That cannot fly.',
    ],
  },
  {
    day: 6,
    author: 'ROBERT FROST',
    theme: 'Bền bỉ & Kiên định',
    lines: [
      'The woods are lovely, dark and deep,',
      'But I have promises to keep,',
      'And miles to go before I sleep,',
      'And miles to go before I sleep.',
    ],
  },
  {
    day: 7,
    author: 'E. B. BROWNING',
    theme: 'Niềm tin',
    lines: [
      'How do I love thee? Let me count the ways.',
      'I love thee to the depth and breadth and height',
      'My soul can reach, when feeling out of sight',
      'For the ends of being and ideal grace.',
    ],
  },
  {
    day: 8,
    author: 'RABINDRANATH TAGORE',
    theme: 'Niềm tin trước bình minh',
    lines: [
      'Faith is the bird that feels the light',
      'And sings when the dawn is still dark.',
      'Let your courage shine through the shadow,',
      'And leave on the night your quiet mark.',
    ],
  },
  {
    day: 9,
    author: 'ARTHUR HUGH CLOUGH',
    theme: 'Vượt qua gian lao',
    lines: [
      'Say not the struggle nought availeth,',
      'The labour and the wounds are vain,',
      'For far back, through creeks and inlets making,',
      'Comes silent, flooding in, the main.',
    ],
  },
  {
    day: 10,
    author: 'KAHLIL GIBRAN',
    theme: 'Kiên cường từ thử thách',
    lines: [
      'Out of suffering have emerged the strongest souls;',
      'The most massive characters are seamed with scars;',
      'Through deepest winter night their spirit glows,',
      'Unbroken underneath eternal stars.',
    ],
  },
  {
    day: 11,
    author: 'RALPH WALDO EMERSON',
    theme: 'Bản lĩnh & Niềm tin',
    lines: [
      'What lies behind us and what lies before us',
      'Are tiny matters compared to what lies within us.',
      'Stand firm against the shifting tide,',
      'With quiet faith and steadfast pride.',
    ],
  },
  {
    day: 12,
    author: 'WILLIAM SHAKESPEARE',
    theme: 'Niềm tin bất biến',
    lines: [
      'Love is not love which alters when it alteration finds,',
      'Or bends with the remover to remove:',
      'O no! it is an ever-fixed mark',
      'That looks on tempests and is never shaken.',
    ],
  },
  {
    day: 13,
    author: 'ELLA WHEELER WILCOX',
    theme: 'Ý chí & Định hướng',
    lines: [
      'One ship drives east and another drives west',
      'With the selfsame winds that blow.',
      '’Tis the set of the sails and not the gales',
      'Which tells us the way to go.',
    ],
  },
  {
    day: 14,
    author: 'ROBERT BROWNING',
    theme: 'Niềm tin vào tương lai',
    lines: [
      'Grow old along with me! The best is yet to be,',
      'The last of life, for which the first was made.',
      'Our times are in his hand, united firm we stand,',
      'Two beating hearts whom nothing shall dissuade.',
    ],
  },
  {
    day: 15,
    author: 'VICTOR HUGO',
    theme: 'Hy vọng',
    lines: [
      'Even the darkest night will end and the sun will rise.',
      'Have faith in the quiet morning light,',
      'No storm can quench the inner flame',
      'That burns with truth through the longest night.',
    ],
  },
  {
    day: 16,
    author: 'EMILY BRONTË',
    theme: 'Linh hồn kiên định',
    lines: [
      'Whatever our souls are made of, yours and mine are the same.',
      'Through shadows, storms, and the silent falling rain,',
      'I speak your name into the quiet dark,',
      'And find in you my sanctuary and my spark.',
    ],
  },
  {
    day: 17,
    author: 'H. W. LONGFELLOW',
    theme: 'Vững bước tiến lên',
    lines: [
      'Let us, then, be up and doing,',
      'With a heart for any fate;',
      'Still achieving, still pursuing,',
      'Learn to labour and to wait.',
    ],
  },
  {
    day: 18,
    author: 'JALAL AL-DIN RUMI',
    theme: 'Hy vọng trong vết thương',
    lines: [
      'The wound is the place where the Light enters you.',
      'Do not grieve. Anything you lose comes round',
      'In another form of grace and strength,',
      'On sacred, unshakeable ground.',
    ],
  },
  {
    day: 19,
    author: 'WILLIAM BLAKE',
    theme: 'Niềm tin vào kỳ tích',
    lines: [
      'To see a World in a Grain of Sand',
      'And a Heaven in a Wild Flower,',
      'Hold Infinity in the palm of your hand',
      'And Eternity in an hour.',
    ],
  },
  {
    day: 20,
    author: 'JOHN KEATS',
    theme: 'Kiên định bất biến',
    lines: [
      'Bright star, would I were steadfast as thou art,',
      'Not in lone splendour hung aloft the night,',
      'Pillowed upon my fair love’s ripening breast,',
      'To feel for ever its soft fall and swell.',
    ],
  },
  {
    day: 21,
    author: 'WALT WHITMAN',
    theme: 'Hướng về ánh sáng',
    lines: [
      'Keep your face always toward the sunshine,',
      'And shadows will fall behind you.',
      'Walk fearless into the wide unknown,',
      'With the spark of life to guide you.',
    ],
  },
  {
    day: 22,
    author: 'HERMANN HESSE',
    theme: 'Chốn nương tựa bình yên',
    lines: [
      'If I know what love is, it is because of you.',
      'A quiet anchor when the world turns wild and cold,',
      'A golden thread of devotion woven true,',
      'A bond more precious than the finest gold.',
    ],
  },
  {
    day: 23,
    author: 'MARY OLIVER',
    theme: 'Trân quý sinh mệnh',
    lines: [
      'Tell me, what is it you plan to do',
      'With your one wild and precious life?',
      'Breathe in the morning, cast off the strife,',
      'And meet the new day with open eyes.',
    ],
  },
  {
    day: 24,
    author: 'PERCY B. SHELLEY',
    theme: 'Hòa quyện thuần khiết',
    lines: [
      'The fountains mingle with the river',
      'And the rivers with the ocean,',
      'Two spirits bound in quiet strength,',
      'With deep and pure devotion.',
    ],
  },
  {
    day: 25,
    author: 'FRIEDRICH NIETZSCHE',
    theme: 'Ý chí kiên cường',
    lines: [
      'He who has a why to live can bear almost any how.',
      'Stand upright when the tempest roars,',
      'The roots run deep beneath the ground,',
      'Above the storm the spirit soars.',
    ],
  },
  {
    day: 26,
    author: 'ANTOINE DE SAINT-EXUPÉRY',
    theme: 'Niềm tin từ trái tim',
    lines: [
      'It is only with the heart that one can see rightly;',
      'What is essential is invisible to the eye.',
      'A quiet truth that will not fade,',
      'Beneath the vast and starry sky.',
    ],
  },
  {
    day: 27,
    author: 'CHRISTINA ROSSETTI',
    theme: 'Niềm vui & Hy vọng',
    lines: [
      'My heart is like a singing bird',
      'Whose nest is in a watered shoot;',
      'My heart is gladder than all these,',
      'Because my love is come to me.',
    ],
  },
  {
    day: 28,
    author: 'EDGAR ALLAN POE',
    theme: 'Tình cảm son sắt',
    lines: [
      'We loved with a love that was more than love—',
      'I and my dearest soul, my heart’s delight;',
      'With a devotion that time cannot undo,',
      'Through all the shadows of the night.',
    ],
  },
  {
    day: 29,
    author: 'ARTHUR O’SHAUGHNESSY',
    theme: 'Ước mơ & Tương lai',
    lines: [
      'We are the music makers,',
      'And we are the dreamers of dreams,',
      'Wandering by lone sea-breakers,',
      'Yet bringing dawn with silver beams.',
    ],
  },
  {
    day: 30,
    author: 'WILLIAM ERNEST HENLEY',
    theme: 'Làm chủ số phận',
    lines: [
      'It matters not how strait the gate,',
      'How charged with punishments the scroll,',
      'I am the master of my fate,',
      'I am the captain of my soul.',
    ],
  },
  {
    day: 31,
    author: 'KHALED HOSSEINI',
    theme: 'Lời hứa kiên định & Hy vọng',
    lines: [
      'For you, a thousand times over.',
      'Through every trial, through frost and night,',
      'Our love remains an unextinguished fire,',
      'Our silver sanctuary, our guiding light.',
    ],
  },
];

/**
 * Tính mùa theo quy tắc:
 * - Mùa Xuân: Từ tháng 1 đến tháng 3 (Spring)
 * - Mùa Hạ: Từ tháng 4 đến tháng 6 (Summer)
 * - Mùa Thu: Từ tháng 7 đến tháng 9 (Autumn)
 * - Mùa Đông: Từ tháng 10 đến tháng 12 (Winter)
 */
export const getSeasonName = (date: Date = new Date()): string => {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 1 && month <= 3) return 'Spring';
  if (month >= 4 && month <= 6) return 'Summer';
  if (month >= 7 && month <= 9) return 'Autumn';
  return 'Winter';
};

export const getSeasonDisplay = (date: Date = new Date()): string => {
  return `${getSeasonName(date)} · ${date.getFullYear()}`;
};
