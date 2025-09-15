// export const dummyProduct = {
//     items: [
//     { product_id: 1, name: "베이직 티셔츠", price: 15000, category_id: 11, is_active: true, created_at:
//       "2024-01-01T10:00:00Z" },
//     { product_id: 2, name: "슬림핏 청바지", price: 45000, category_id: 12, is_active: false, created_at:
//       "2024-01-02T11:00:00Z" },
//     { product_id: 3, name: "오버사이즈 후드티", price: 32000, category_id: 11, is_active: true, created_at:
//       "2024-01-03T12:00:00Z" },
//         { product_id: 4, name: "롱 슬랙스", price: 38000, category_id: 12, is_active: true, created_at:
//     "2024-01-04T13:00:00Z" },
//         { product_id: 5, name: "데일리 스니커즈", price: 65000, category_id: 14, is_active: true, created_at:
//     "2024-01-05T14:00:00Z" },
//         { product_id: 6, name: "스트라이프 셔츠", price: 28000, category_id: 11, is_active: true, created_at:
//     "2024-01-06T15:00:00Z" },
//         { product_id: 7, name: "와이드 팬츠", price: 42000, category_id: 12, is_active: true, created_at:
//     "2024-01-07T16:00:00Z" },
//       { product_id: 8, name: "경량 패딩 조끼", price: 55000, category_id: 13, is_active: true, created_at:
//     "2024-01-08T17:00:00Z" },
//       { product_id: 9, name: "기본 반팔 티", price: 12000, category_id: 11, is_active: true, created_at:
//     "2024-01-09T18:00:00Z" },
//       { product_id: 10, name: "데님 스커트", price: 30000, category_id: 12, is_active: true, created_at:
//     "2024-01-10T19:00:00Z" },
//       { product_id: 11, name: "캐주얼 백팩", price: 70000, category_id: 15, is_active: true, created_at:
//     "2024-01-11T20:00:00Z" },
//       { product_id: 12, name: "니트 가디건", price: 35000, category_id: 13, is_active: true, created_at:
//     "2024-01-12T21:00:00Z" },
//       { product_id: 13, name: "슬립온 슈즈", price: 58000, category_id: 14, is_active: true, created_at:
//     "2024-01-13T22:00:00Z" },
//       { product_id: 14, name: "체크 셔츠", price: 29000, category_id: 11, is_active: true, created_at:
//     "2024-01-14T23:00:00Z" },
//       { product_id: 15, name: "코튼 반바지", price: 25000, category_id: 12, is_active: true, created_at:
//     "2024-01-15T09:00:00Z" },
//       { product_id: 16, name: "트레이닝 세트", price: 75000, category_id: 13, is_active: true, created_at:
//     "2024-01-16T10:00:00Z" },
//       { product_id: 17, name: "미니 크로스백", price: 40000, category_id: 15, is_active: true, created_at:
//     "2024-01-17T11:00:00Z" },
//       { product_id: 18, name: "플리츠 스커트", price: 33000, category_id: 12, is_active: true, created_at:
//     "2024-01-18T12:00:00Z" },
//       { product_id: 19, name: "스웨트 셔츠", price: 29000, category_id: 11, is_active: true, created_at:
//     "2024-01-19T13:00:00Z" },
//       { product_id: 20, name: "슬림핏 원피스", price: 50000, category_id: 13, is_active: true, created_at:
//     "2024-01-20T14:00:00Z" }
//       ],
//       total: 57,
//       page: 1,
//       size: 20
//     };

export const dummyProduct = {
  count: 57,
  next: null,
  previous: null,
  results: [
    {
      product_id: 1,
      name: "여름 반팔 티",
      description: "시원한 소재로 만든 여름용 반팔 티셔츠입니다.",
      price: 19000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-11T17:35:14.152345+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Navy", display: "네이비", hexCode: "#001F3F" },
            { value: "White", display: "화이트", hexCode: "#FFFFFF" },
            { value: "Black", display: "블랙", hexCode: "#000000" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "S", display: "S" },
            { value: "M", display: "M" },
            { value: "L", display: "L" }
        ]}
      ]
    },
    {
      product_id: 2,
      name: "슬림핏 청바지",
      description: "편안하면서도 다리 라인을 잡아주는 슬림핏 청바지입니다.",
      price: 49000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-12T10:20:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Blue", display: "청색", hexCode: "#34568B" }
        ]},
        { id: "OPT_WAIST", name: "허리사이즈", type: "size", values: [
            { value: "28", display: "28" },
            { value: "30", display: "30" },
            { value: "32", display: "32" }
        ]}
      ]
    },
    {
      product_id: 3,
      name: "가을 니트 스웨터",
      description: "부드러운 촉감의 가을용 니트 스웨터.",
      price: 59000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-13T11:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Beige", display: "베이지", hexCode: "#F5F5DC" },
            { value: "Gray", display: "그레이", hexCode: "#808080" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "M", display: "M" },
            { value: "L", display: "L" },
            { value: "XL", display: "XL" }
        ]}
      ]
    },
    {
      product_id: 4,
      name: "겨울 오버핏 코트",
      description: "따뜻한 울 소재의 오버핏 코트입니다.",
      price: 189000,
      category_id: 3,
      is_active: true,
      created_at: "2025-09-14T14:30:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Camel", display: "카멜", hexCode: "#C19A6B" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "Free", display: "Free" }
        ]}
      ]
    },
    {
      product_id: 5,
      name: "코튼 밴딩 슬랙스",
      description: "허리 밴딩으로 편안함을 더한 코튼 슬랙스.",
      price: 39000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-15T09:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Khaki", display: "카키", hexCode: "#8F9779" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "S", display: "S" },
            { value: "M", display: "M" },
            { value: "L", display: "L" }
        ]}
      ]
    },
    {
      product_id: 6,
      name: "스트라이프 셔츠",
      description: "클래식한 디자인의 스트라이프 셔츠입니다.",
      price: 45000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-15T11:25:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "BlueStripe", display: "블루 스트라이프", hexCode: "#A7C7E7" },
            { value: "RedStripe", display: "레드 스트라이프", hexCode: "#FFB6C1" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "95", display: "95" },
            { value: "100", display: "100" },
            { value: "105", display: "105" }
        ]}
      ]
    },
    {
      product_id: 7,
      name: "후드 집업",
      description: "간절기에 입기 좋은 베이직 후드 집업.",
      price: 62000,
      category_id: 3,
      is_active: true,
      created_at: "2025-09-16T13:10:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Gray", display: "그레이", hexCode: "#808080" },
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Melange", display: "멜란지", hexCode: "#D3D3D3" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "M", display: "M" },
            { value: "L", display: "L" },
            { value: "XL", display: "XL" }
        ]}
      ]
    },
    {
      product_id: 8,
      name: "카고 반바지",
      description: "수납공간이 넉넉한 카고 스타일의 반바지입니다.",
      price: 34000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-17T18:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Beige", display: "베이지", hexCode: "#F5F5DC" },
            { value: "Olive", display: "올리브", hexCode: "#808000" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "M", display: "M" },
            { value: "L", display: "L" }
        ]}
      ]
    },
    {
      product_id: 9,
      name: "린넨 셔츠",
      description: "시원하고 통기성이 좋은 린넨 셔츠.",
      price: 52000,
      category_id: 1,
      is_active: false,
      created_at: "2025-09-18T10:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "White", display: "화이트", hexCode: "#FFFFFF" },
            { value: "SkyBlue", display: "스카이블루", hexCode: "#87CEEB" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "M", display: "M" },
            { value: "L", display: "L" }
        ]}
      ]
    },
    {
      product_id: 10,
      name: "경량 패딩 조끼",
      description: "가볍고 따뜻한 경량 패딩 조끼입니다.",
      price: 79000,
      category_id: 3,
      is_active: true,
      created_at: "2025-09-19T12:45:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Navy", display: "네이비", hexCode: "#001F3F" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "100", display: "100" },
            { value: "105", display: "105" }
        ]}
      ]
    },
    {
      product_id: 11,
      name: "옥스포드 셔츠",
      description: "클래식한 디자인의 옥스포드 셔츠.",
      price: 48000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-20T11:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "White", display: "화이트", hexCode: "#FFFFFF" },
            { value: "Blue", display: "블루", hexCode: "#0000FF" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "M", display: "M" },
            { value: "L", display: "L" },
            { value: "XL", display: "XL" }
        ]}
      ]
    },
    {
      product_id: 12,
      name: "와이드 데님 팬츠",
      description: "트렌디한 와이드 핏의 데님 팬츠입니다.",
      price: 55000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-21T14:20:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "LightBlue", display: "연청", hexCode: "#ADD8E6" },
            { value: "DeepBlue", display: "진청", hexCode: "#00008B" }
        ]},
        { id: "OPT_WAIST", name: "허리사이즈", type: "size", values: [
            { value: "28", display: "28" },
            { value: "30", display: "30" },
            { value: "32", display: "32" }
        ]}
      ]
    },
    {
      product_id: 13,
      name: "캐시미어 머플러",
      description: "부드러운 캐시미어 소재의 머플러.",
      price: 89000,
      category_id: 4,
      is_active: true,
      created_at: "2025-09-22T10:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Gray", display: "그레이", hexCode: "#808080" },
            { value: "Brown", display: "브라운", hexCode: "#A52A2A" }
        ]}
      ]
    },
    {
      product_id: 14,
      name: "맨투맨 스웨트셔츠",
      description: "베이직한 디자인의 맨투맨 스웨트셔츠.",
      price: 42000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-23T16:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Oatmeal", display: "오트밀", hexCode: "#EAE7DC" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "S", display: "S" },
            { value: "M", display: "M" },
            { value: "L", display: "L" }
        ]}
      ]
    },
    {
      product_id: 15,
      name: "치노 팬츠",
      description: "클래식한 스타일의 치노 팬츠입니다.",
      price: 47000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-24T09:30:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Beige", display: "베이지", hexCode: "#F5F5DC" },
            { value: "Navy", display: "네이비", hexCode: "#001F3F" }
        ]},
        { id: "OPT_WAIST", name: "허리사이즈", type: "size", values: [
            { value: "30", display: "30" },
            { value: "32", display: "32" },
            { value: "34", display: "34" }
        ]}
      ]
    },
    {
      product_id: 16,
      name: "가죽 벨트",
      description: "소가죽으로 제작된 베이직 벨트.",
      price: 35000,
      category_id: 4,
      is_active: true,
      created_at: "2025-09-25T11:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "DarkBrown", display: "다크브라운", hexCode: "#654321" }
        ]}
      ]
    },
    {
      product_id: 17,
      name: "블레이저 자켓",
      description: "모던한 디자인의 블레이저 자켓.",
      price: 129000,
      category_id: 3,
      is_active: true,
      created_at: "2025-09-26T15:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Black", display: "블랙", hexCode: "#000000" },
            { value: "Charcoal", display: "차콜", hexCode: "#36454F" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "95", display: "95" },
            { value: "100", display: "100" },
            { value: "105", display: "105" }
        ]}
      ]
    },
    {
      product_id: 18,
      name: "코듀로이 팬츠",
      description: "따뜻한 느낌의 코듀로이(골덴) 팬츠.",
      price: 58000,
      category_id: 2,
      is_active: true,
      created_at: "2025-09-27T13:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "Cream", display: "크림", hexCode: "#FFFDD0" },
            { value: "Brown", display: "브라운", hexCode: "#A52A2A" }
        ]},
        { id: "OPT_WAIST", name: "허리사이즈", type: "size", values: [
            { value: "S", display: "S" },
            { value: "M", display: "M" }
        ]}
      ]
    },
    {
      product_id: 19,
      name: "플란넬 셔츠",
      description: "부드럽고 따뜻한 플란넬 체크 셔츠.",
      price: 53000,
      category_id: 1,
      is_active: true,
      created_at: "2025-09-28T17:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "RedCheck", display: "레드체크", hexCode: "#FF0000" },
            { value: "GreenCheck", display: "그린체크", hexCode: "#008000" }
        ]},
        { id: "OPT_SIZE", name: "사이즈", type: "size", values: [
            { value: "L", display: "L" },
            { value: "XL", display: "XL" }
        ]}
      ]
    },
    {
      product_id: 20,
      name: "캔버스 스니커즈",
      description: "어디에나 잘 어울리는 기본 캔버스 스니커즈.",
      price: 49000,
      category_id: 5,
      is_active: true,
      created_at: "2025-09-29T10:00:00.000000+09:00",
      options: [
        { id: "OPT_COLOR", name: "색상", type: "color", values: [
            { value: "White", display: "화이트", hexCode: "#FFFFFF" },
            { value: "Black", display: "블랙", hexCode: "#000000" }
        ]},
        { id: "OPT_FOOT_SIZE", name: "발사이즈", type: "size", values: [
            { value: "260", display: "260" },
            { value: "270", display: "270" },
            { value: "280", display: "280" }
        ]}
      ]
    }
  ]
};
