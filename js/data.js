// VocabVibe: data.js = the starter word lists.
// To add a word, copy one line, change the text, and keep every id unique.
// Fields: term, pos (part of speech), level, category, pron, def (meaning), ex (example).
// Known / Need practice marks are saved by the app, so you do not need a status field.
// cls = class number from 1 to 50 (optional). A word with no cls is in Class 1.
// Korean also uses: roman (romanisation) and extr (English translation of the example).

// ✏️ To add, change or delete a word: edit this file, save it, and refresh the browser.
// ===== 1. ENGLISH WORDS =====
const DEFAULT_WORDS = [
  { id:"w1", term:"Resilient", pos:"Adjective", level:"Intermediate", category:"Character", pron:"/rɪˈzɪl.i.ənt/", def:"Able to recover quickly after a difficult situation.", ex:"She was resilient and tried again after failing the exam.", status:"new" },
  { id:"w2", term:"Tender", pos:"Adjective", level:"Intermediate", category:"Character", pron:"/ˈten.dər/", def:"Gentle and kind; showing care.", ex:"He spoke to the child in a tender voice.", status:"new" },
  { id:"w3", term:"Borrow", pos:"Verb", level:"Beginner", category:"Daily life", pron:"/ˈbɒr.əʊ/", def:"To take something for a short time and give it back.", ex:"Can I borrow your pen, please?", status:"new" },
  { id:"w4", term:"Schedule", pos:"Noun", level:"Beginner", category:"Daily life", pron:"/ˈʃed.juːl/", def:"A plan that lists when things will happen.", ex:"My schedule is full on Monday.", status:"new" },
  { id:"w5", term:"Ephemeral", pos:"Adjective", level:"Advanced", category:"Academic", pron:"/ɪˈfem.ər.əl/", def:"Lasting for a very short time.", ex:"Cherry blossoms are ephemeral; they last only a few days.", status:"new" },
  { id:"w6", term:"Cheerful", pos:"Adjective", level:"Beginner", category:"Feelings", pron:"/ˈtʃɪə.fəl/", def:"Happy and positive.", ex:"The teacher was cheerful this morning.", status:"new" },
  { id:"w7", term:"Reluctant", pos:"Adjective", level:"Intermediate", category:"Feelings", pron:"/rɪˈlʌk.tənt/", def:"Not wanting to do something.", ex:"He was reluctant to speak in front of the class.", status:"new" },
  { id:"w8", term:"Gather", pos:"Verb", level:"Beginner", category:"Daily life", pron:"/ˈɡæð.ər/", def:"To bring or come together in one place.", ex:"Students gather in the hall at 9 a.m.", status:"new" },
  { id:"w9", term:"Meticulous", pos:"Adjective", level:"Advanced", category:"Academic", pron:"/məˈtɪk.jə.ləs/", def:"Very careful about small details.", ex:"The scientist kept meticulous notes.", status:"new" },
  { id:"w10", term:"Improve", pos:"Verb", level:"Beginner", category:"Study", pron:"/ɪmˈpruːv/", def:"To become better or make something better.", ex:"Reading every day will improve your English.", status:"new" },
  { id:"w11", term:"Ambitious", pos:"Adjective", level:"Intermediate", category:"Character", pron:"/æmˈbɪʃ.əs/", def:"Having a strong wish to succeed or achieve something.", ex:"She is ambitious and wants to study abroad.", status:"new" },
  { id:"w12", term:"Eloquent", pos:"Adjective", level:"Advanced", category:"Academic", pron:"/ˈel.ə.kwənt/", def:"Able to speak or write clearly and convincingly.", ex:"Her eloquent speech moved the audience.", status:"new" }
];

// ===== 2. KOREAN WORDS =====
// ✏️ Korean starter words. roman = romanisation, pron = learner sound guide, extr = English translation of the example.
const DEFAULT_KO = [
  
  // Beginner
  // Class 1
  { id: "k1", term: "가수", pos: "Noun", level: "Beginner", category: "People", roman: "gasu", pron: "gah-soo (approximate)", def: "Singer.", ex: "저는 가수를 좋아해요.", extr: "I like the singer.", status: "new" },
  { id: "k2", term: "아기", pos: "Noun", level: "Beginner", category: "People", roman: "agi", pron: "ah-gee (approximate)", def: "Baby.", ex: "아기가 귀여워요.", extr: "The baby is cute.", status: "new" },
  { id: "k3", term: "네모", pos: "Noun", level: "Beginner", category: "Shapes", roman: "nemo", pron: "neh-moh (approximate)", def: "Square / Rectangle.", ex: "이것은 네모 모양이에요.", extr: "This is a square shape.", status: "new" },
  { id: "k4", term: "다리", pos: "Noun", level: "Beginner", category: "Body Parts", roman: "dari", pron: "dah-ree (approximate)", def: "Leg / Bridge.", ex: "다리가 아파요.", extr: "My leg hurts.", status: "new" },
  { id: "k5", term: "소리", pos: "Noun", level: "Beginner", category: "Sounds", roman: "sori", pron: "soh-ree (approximate)", def: "Sound / Noise.", ex: "좋은 소리가 나요.", extr: "It makes a nice sound.", status: "new" },
  { id: "k6", term: "모자", pos: "Noun", level: "Beginner", category: "Clothing", roman: "moja", pron: "moh-jah (approximate)", def: "Hat / Cap.", ex: "모자를 써요.", extr: "I wear a hat.", status: "new" },
  { id: "k7", term: "아버지", pos: "Noun", level: "Beginner", category: "Family", roman: "abeoji", pron: "ah-buh-jee (approximate)", def: "Father.", ex: "아버지는 회사원이에요.", extr: "My father is an office worker.", status: "new" },
  { id: "k8", term: "사자", pos: "Noun", level: "Beginner", category: "Animals", roman: "saja", pron: "sah-jah (approximate)", def: "Lion.", ex: "사자는 동물의 왕이에요.", extr: "The lion is the king of animals.", status: "new" },
  { id: "k9", term: "새우", pos: "Noun", level: "Beginner", category: "Food", roman: "saeu", pron: "seh-oo (approximate)", def: "Shrimp.", ex: "저는 새우를 좋아해요.", extr: "I like shrimp.", status: "new" },
  { id: "k10", term: "가구", pos: "Noun", level: "Beginner", category: "Furniture", roman: "gagu", pron: "gah-goo (approximate)", def: "Furniture.", ex: "새 가구를 샀어요.", extr: "I bought new furniture.", status: "new" },

  // Class 2
  { id: "k11", term: "치마", pos: "Noun", level: "Beginner", category: "Clothing", cls: 2, roman: "chima", pron: "chee-mah (approximate)", def: "Skirt.", ex: "치마를 입어요.", extr: "I wear a skirt.", status: "new" },
  { id: "k12", term: "코", pos: "Noun", level: "Beginner", category: "Body Parts", cls: 2, roman: "ko", pron: "koh (approximate)", def: "Nose.", ex: "코가 커요.", extr: "The nose is big.", status: "new" },
  { id: "k13", term: "타조", pos: "Noun", level: "Beginner", category: "Animals", cls: 2, roman: "tajo", pron: "tah-joh (approximate)", def: "Ostrich.", ex: "타조가 달려요.", extr: "The ostrich runs.", status: "new" },
  { id: "k14", term: "포도", pos: "Noun", level: "Beginner", category: "Food", cls: 2, roman: "podo", pron: "poh-doh (approximate)", def: "Grape.", ex: "포도를 먹어요.", extr: "I eat grapes.", status: "new" },
  { id: "k15", term: "카메라", pos: "Noun", level: "Beginner", category: "Objects", cls: 2, roman: "kamera", pron: "kah-meh-rah (approximate)", def: "Camera.", ex: "카메라로 사진을 찍어요.", extr: "I take a picture with a camera.", status: "new" },
  { id: "k16", term: "스키", pos: "Noun", level: "Beginner", category: "Sports", cls: 2, roman: "seuki", pron: "suh-kee (approximate)", def: "Ski / Skiing.", ex: "스키를 타요.", extr: "I go skiing.", status: "new" },
  { id: "k17", term: "커피", pos: "Noun", level: "Beginner", category: "Food", cls: 2, roman: "keopi", pron: "kuh-pee (approximate)", def: "Coffee.", ex: "커피를 마셔요.", extr: "I drink coffee.", status: "new" },
  { id: "k18", term: "기차", pos: "Noun", level: "Beginner", category: "Transportation", cls: 2, roman: "gicha", pron: "gee-chah (approximate)", def: "Train.", ex: "기차를 타요.", extr: "I ride a train.", status: "new" },
  { id: "k19", term: "피아노", pos: "Noun", level: "Beginner", category: "Instruments", cls: 2, roman: "piano", pron: "pee-ah-noh (approximate)", def: "Piano.", ex: "피아노를 쳐요.", extr: "I play the piano.", status: "new" },

  // Class 3
  { id: "k20", term: "선생님", pos: "Noun", level: "Beginner", category: "School", cls: 3, roman: "seonsaengnim", pron: "seon-saeng-nim (approximate)", def: "Teacher.", ex: "선생님, 안녕하세요?", extr: "Hello, teacher?", status: "new" },
  { id: "k21", term: "학생", pos: "Noun", level: "Beginner", category: "School", cls: 3, roman: "haksaeng", pron: "hak-saeng (approximate)", def: "Student.", ex: "저는 학생이에요.", extr: "I am a student.", status: "new" },
  { id: "k22", term: "반 친구", pos: "Noun", level: "Beginner", category: "School", cls: 3, roman: "ban chingu", pron: "ban ching-gu (approximate)", def: "Classmate.", ex: "반 친구들과 놀아요.", extr: "I play with my classmates.", status: "new" },
  { id: "k23", term: "칠판", pos: "Noun", level: "Beginner", category: "School", cls: 3, roman: "chilpan", pron: "chil-pan (approximate)", def: "Blackboard / Chalkboard.", ex: "칠판을 봐요.", extr: "Look at the blackboard.", status: "new" },
  { id: "k24", term: "책상", pos: "Noun", level: "Beginner", category: "Furniture", cls: 3, roman: "chaeksang", pron: "chaek-sang (approximate)", def: "Desk.", ex: "책상 위에 책이 있어요.", extr: "There is a book on the desk.", status: "new" },
  { id: "k25", term: "의자", pos: "Noun", level: "Beginner", category: "Furniture", cls: 3, roman: "uija", pron: "wee-jah (approximate)", def: "Chair.", ex: "의자에 앉아요.", extr: "I sit on the chair.", status: "new" },
  { id: "k26", term: "책", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "chaek", pron: "chaek (approximate)", def: "Book.", ex: "책을 읽어요.", extr: "I read a book.", status: "new" },
  { id: "k27", term: "공책", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "gongchaek", pron: "gong-chaek (approximate)", def: "Notebook.", ex: "공책에 씁니다.", extr: "I write in the notebook.", status: "new" },
  { id: "k28", term: "연필", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "yeonpil", pron: "yeon-pil (approximate)", def: "Pencil.", ex: "연필로 씁니다.", extr: "I write with a pencil.", status: "new" },
  { id: "k29", term: "볼펜", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "bolpen", pron: "bol-pen (approximate)", def: "Ballpoint pen.", ex: "볼펜으로 씁니다.", extr: "I write with a ballpoint pen.", status: "new" },
  { id: "k30", term: "지우개", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "jiugae", pron: "ji-oo-gae (approximate)", def: "Eraser.", ex: "지우개로 지워요.", extr: "I erase with an eraser.", status: "new" },
  { id: "k31", term: "필통", pos: "Noun", level: "Beginner", category: "School Supplies", cls: 3, roman: "piltong", pron: "pil-tong (approximate)", def: "Pencil case.", ex: "필통에 연필이 있어요.", extr: "There are pencils in the pencil case.", status: "new" },
  { id: "k32", term: "시계", pos: "Noun", level: "Beginner", category: "Objects", cls: 3, roman: "sigye", pron: "si-gye (approximate)", def: "Clock / Watch.", ex: "시계를 봐요.", extr: "I look at the clock.", status: "new" },
  { id: "k33", term: "달력", pos: "Noun", level: "Beginner", category: "Objects", cls: 3, roman: "dallyeok", pron: "dal-lyeok (approximate)", def: "Calendar.", ex: "달력을 확인해요.", extr: "I check the calendar.", status: "new" },
  { id: "k34", term: "창문", pos: "Noun", level: "Beginner", category: "Building", cls: 3, roman: "changmun", pron: "chang-mun (approximate)", def: "Window.", ex: "창문을 열어요.", extr: "I open the window.", status: "new" },
  { id: "k35", term: "문", pos: "Noun", level: "Beginner", category: "Building", cls: 3, roman: "mun", pron: "mun (approximate)", def: "Door.", ex: "문을 닫아요.", extr: "I close the door.", status: "new" },

  // Class 4
  { id: "k36", term: "학생", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "haksaeng", pron: "hak-saeng (approximate)", def: "Student.", ex: "저는 학생이에요.", extr: "I am a student.", status: "new", image: "k36 학생" },
  { id: "k37", term: "선생님", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "seonsaengnim", pron: "seon-saeng-nim (approximate)", def: "Teacher.", ex: "선생님을 만나요.", extr: "I meet the teacher.", status: "new", image: "k37 선생님" },
  { id: "k38", term: "회사원", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "hoesawon", pron: "hoe-sa-won (approximate)", def: "Office worker / Company employee.", ex: "저는 회사원이에요.", extr: "I am an office worker.", status: "new", image: "k38 회사원" },
  { id: "k39", term: "주부", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "jubu", pron: "ju-bu (approximate)", def: "Housewife / Homemaker.", ex: "어머니는 주부예요.", extr: "My mother is a housewife.", status: "new", image: "k39 주부" },
  { id: "k40", term: "경찰관", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "gyeongchalgwan", pron: "gyeong-chal-gwan (approximate)", def: "Police officer.", ex: "경찰관이어요.", extr: "He is a police officer.", status: "new", image: "k40 경찰관" },
  { id: "k41", term: "소방관", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "sobanggwan", pron: "so-bang-gwan (approximate)", def: "Firefighter.", ex: "소방관이 불을 꺼요.", extr: "The firefighter puts out the fire.", status: "new", image: "k41 소방관" },
  { id: "k42", term: "공무원", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "gongmuwon", pron: "gong-mu-won (approximate)", def: "Public official / Government employee.", ex: "공무원으로 일해요.", extr: "I work as a public official.", status: "new", image: "k42 공무원" },
  { id: "k43", term: "점원", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "jeomwon", pron: "jeom-won (approximate)", def: "Store clerk / Shop assistant.", ex: "점원이 친절해요.", extr: "The store clerk is kind.", status: "new", image: "k43 점원" },
  { id: "k44", term: "의사", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "uisa", pron: "ui-sa (approximate)", def: "Doctor.", ex: "아버지는 의사예요.", extr: "My father is a doctor.", status: "new", image: "k44 의사" },
  { id: "k45", term: "간호사", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "ganhosa", pron: "gan-ho-sa (approximate)", def: "Nurse.", ex: "간호사가 환자를 돌봐요.", extr: "The nurse takes care of the patient.", status: "new", image: "k45 간호사" },
  { id: "k46", term: "요리사", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "yorisa", pron: "yo-ri-sa (approximate)", def: "Chef / Cook.", ex: "요리사가 음식을 만들어요.", extr: "The chef makes food.", status: "new", image: "k46 요리사" },
  { id: "k47", term: "운전기사", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "unjeongisa", pron: "un-jeon-gi-sa (approximate)", def: "Driver.", ex: "버스 운전기사예요.", extr: "He is a bus driver.", status: "new", image: "k47 운전기사" },
  { id: "k48", term: "기술자", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "gisulja", pron: "gi-sul-ja (approximate)", def: "Technician / Engineer.", ex: "기술자로 일해요.", extr: "I work as a technician.", status: "new", image: "k48 기술자" },
  { id: "k49", term: "목수", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "moksu", pron: "mok-su (approximate)", def: "Carpenter.", ex: "목수가 가구를 만들어요.", extr: "The carpenter makes furniture.", status: "new", image: "k49 목수" },
  { id: "k50", term: "농부", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "nongbu", pron: "nong-bu (approximate)", def: "Farmer.", ex: "농부가 쌀을 키워요.", extr: "The farmer grows rice.", status: "new", image: "k50 농부" },
  { id: "k51", term: "어부", pos: "Noun", level: "Beginner", category: "Occupations", cls: 4, roman: "eobu", pron: "eo-bu (approximate)", def: "Fisherman.", ex: "어부가 고기를 잡아요.", extr: "The fisherman catches fish.", status: "new", image: "k51 어부" },

  // Class 5
  { id: "k52", term: "여기", pos: "Pronoun", level: "Beginner", category: "Places", cls: 5, roman: "yeogi", pron: "yeo-gi (approximate)", def: "Here / This place.", ex: "여기가 우리 회사예요.", extr: "This place is our company.", status: "new", image: "k52 여기" },
  { id: "k53", term: "저기", pos: "Pronoun", level: "Beginner", category: "Places", cls: 5, roman: "jeogi", pron: "jeo-gi (approximate)", def: "There / Over there (far away).", ex: "저기가 은행이에요.", extr: "Over there is the bank.", status: "new", image: "k53 저기" },
  { id: "k54", term: "거기", pos: "Pronoun", level: "Beginner", category: "Places", cls: 5, roman: "geogi", pron: "geo-gi (approximate)", def: "There (near the listener).", ex: "거기가 어디예요?", extr: "Where is that place?", status: "new", image: "k54 거기" },
  { id: "k55", term: "어디", pos: "Pronoun", level: "Beginner", category: "Places", cls: 5, roman: "eodi", pron: "eo-di (approximate)", def: "Where.", ex: "화장실이 어디에 있어요?", extr: "Where is the restroom?", status: "new", image: "k55 어디" },
  { id: "k56", term: "회사", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "hoesa", pron: "hoe-sa (approximate)", def: "Company / Office.", ex: "회사가 요즘 바쁩니다.", extr: "The company is busy these days.", status: "new", image: "k56 회사" },
  { id: "k57", term: "사무실", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "samusil", pron: "sa-mu-sil (approximate)", def: "Office room.", ex: "사무실에 사람이 없어요.", extr: "There is no one in the office.", status: "new", image: "k57 사무실" },
  { id: "k58", term: "화장실", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "hwajangsil", pron: "hwa-jang-sil (approximate)", def: "Restroom / Bathroom.", ex: "화장실이 어디에 있습니까?", extr: "Where is the restroom located?", status: "new", image: "k58 화장실" },
  { id: "k59", term: "식당", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "sikdang", pron: "sik-dang (approximate)", def: "Restaurant / Diner.", ex: "식당에서 점심을 먹어요.", extr: "I eat lunch at the restaurant.", status: "new", image: "k59 식당" },
  { id: "k60", term: "집", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "jip", pron: "jip (approximate)", def: "House / Home.", ex: "집에 가고 싶어요.", extr: "I want to go home.", status: "new", image: "k60 집" },
  { id: "k61", term: "기숙사", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "gisuksa", pron: "gi-suk-sa (approximate)", def: "Dormitory.", ex: "기숙사 생활이 아주 편해요.", extr: "Dormitory life is very comfortable.", status: "new", image: "k61 기숙사" },
  { id: "k62", term: "세탁소", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "setakso", pron: "se-tak-so (approximate)", def: "Laundromat / Dry cleaner.", ex: "세탁소에 옷을 맡겼어요.", extr: "I dropped off clothes at the dry cleaner.", status: "new", image: "k62 세탁소" },
  { id: "k63", term: "미용실", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "miyongsil", pron: "mi-yong-sil (approximate)", def: "Beauty salon / Hair salon.", ex: "미용실에서 머리를 잘라요.", extr: "I get my hair cut at the hair salon.", status: "new", image: "k63 미용실" },
  { id: "k64", term: "시장", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "sijang", pron: "si-jang (approximate)", def: "Market / Traditional market.", ex: "시장에서 과일을 삽니다.", extr: "I buy fruits at the market.", status: "new", image: "k64 시장" },
  { id: "k65", term: "마트", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "mateu", pron: "ma-teu (approximate)", def: "Mart / Supermarket.", ex: "마트에서 우유를 샀어요.", extr: "I bought milk at the mart.", status: "new", image: "k65 마트" },
  { id: "k66", term: "편의점", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "pyonijeom", pron: "pyeo-ni-jeom (approximate)", def: "Convenience store.", ex: "편의점은 24시간 열어요.", extr: "The convenience store is open 24 hours.", status: "new", image: "k66 편의점" },
  { id: "k67", term: "슈퍼마켓", pos: "Noun", level: "Beginner", category: "Places", cls: 5, roman: "syupeomaket", pron: "syu-pe-ma-ket (approximate)", def: "Supermarket.", ex: "집 근처에 슈퍼마켓이 있어요.", extr: "There is a supermarket near my house.", status: "new", image: "k67 슈퍼마켓" },

  // Class 6
  { id: "k68", term: "열쇠", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "yeolswe", pron: "yeol-soe (approximate)", def: "Key.", ex: "열쇠로 문을 열어요.", extr: "I open the door with a key.", status: "new", image: "k68 열쇠" },
  { id: "k69", term: "가족사진", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "gajoksajin", pron: "ga-jok-sa-jin (approximate)", def: "Family picture / Family photo.", ex: "벽에 가족사진이 걸려 있어요.", extr: "A family photo is hanging on the wall.", status: "new", image: "k69 가족사진" },
  { id: "k70", term: "가방", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "gabang", pron: "ga-bang (approximate)", def: "Bag / Handbag / Backpack.", ex: "가방에 책이 들어 있어요.", extr: "There are books in the bag.", status: "new", image: "k70 가방" },
  { id: "k71", term: "지갑", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "jigap", pron: "ji-gap (approximate)", def: "Wallet / Purse.", ex: "지갑에 돈이 없어요.", extr: "There is no money in the wallet.", status: "new", image: "k71 지갑" },
  { id: "k72", term: "여권", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "yeogwon", pron: "yeo-gwon (approximate)", def: "Passport.", ex: "여행을 가려면 여권이 필요해요.", extr: "You need a passport to go traveling.", status: "new", image: "k72 여권" },
  { id: "k73", term: "우산", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "usan", pron: "u-san (approximate)", def: "Umbrella.", ex: "비가 오니까 우산을 씁니다.", extr: "It's raining, so I'm using an umbrella.", status: "new", image: "k73 우산" },
  { id: "k74", term: "거울", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "geoul", pron: "geo-ul (approximate)", def: "Mirror.", ex: "거울을 보고 머리를 빗어요.", extr: "I look in the mirror and brush my hair.", status: "new", image: "k74 거울" },
  { id: "k75", term: "화장품", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "hwajangpum", pron: "hwa-jang-pum (approximate)", def: "Cosmetics / Makeup.", ex: "화장품을 백화점에서 샀어요.", extr: "I bought cosmetics at the department store.", status: "new", image: "k75 화장품" },
  { id: "k76", term: "빗", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "bit", pron: "bit (approximate)", def: "Comb / Hairbrush.", ex: "빗으로 머리를 정돈해요.", extr: "I tidy my hair with a comb.", status: "new", image: "k76 빗" },
  { id: "k77", term: "헤어드라이어", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "heeodeuraieo", pron: "he-eo-deu-ra-i-eo (approximate)", def: "Hair dryer.", ex: "머리를 감고 헤어드라이어로 말려요.", extr: "I wash my hair and dry it with a hair dryer.", status: "new", image: "k77 헤어드라이어" },
  { id: "k78", term: "베개", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "begae", pron: "be-gae (approximate)", def: "Pillow.", ex: "베개가 아주 폭신폭신해요.", extr: "The pillow is very fluffy.", status: "new", image: "k78 베개" },
  { id: "k79", term: "이불", pos: "Noun", level: "Beginner", category: "Objects", cls: 6, roman: "ibul", pron: "i-bul (approximate)", def: "Blanket / Duvet.", ex: "밤에는 이불을 덮고 자요.", extr: "At night, I sleep covered with a blanket.", status: "new", image: "k79 이불" },

  // Class 7
  { id: "k80", term: "텔레비전을 보다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "tellebijeoneul boda", pron: "tel-le-bi-jeon-eul bo-da (approximate)", def: "To watch television.", ex: "저녁에 텔레비전을 봐요.", extr: "I watch TV in the evening.", status: "new", image: "k80 텔레비전을 보다" },
  { id: "k81", term: "장을 보다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "jangeul boda", pron: "jang-eul bo-da (approximate)", def: "To go grocery shopping / To shop for groceries.", ex: "시장에서 장을 봐요.", extr: "I do grocery shopping at the market.", status: "new", image: "k81 장을 보다" },
  { id: "k82", term: "일어나다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "ireonada", pron: "i-reo-na-da (approximate)", def: "To get up / To wake up.", ex: "아침 7시에 일어나요.", extr: "I wake up at 7 AM.", status: "new", image: "k82 일어나다" },
  { id: "k83", term: "자다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "jada", pron: "ja-da (approximate)", def: "To sleep.", ex: "밤에는 침대에서 자요.", extr: "At night, I sleep in bed.", status: "new", image: "k83 자다" },
  { id: "k84", term: "쉬다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "swida", pron: "swi-da (approximate)", def: "To rest / To take a break.", ex: "일요일에는 집에서 쉬어요.", extr: "I rest at home on Sundays.", status: "new", image: "k84 쉬다" },
  { id: "k85", term: "씻다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "ssitda", pron: "ssit-da (approximate)", def: "To wash / To wash up.", ex: "밥 먹기 전에 손을 씻어요.", extr: "I wash my hands before eating.", status: "new", image: "k85 씻다" },
  { id: "k86", term: "커피를 마시다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "keopireul masida", pron: "keo-pi-reul ma-si-da (approximate)", def: "To drink coffee.", ex: "아침에 커피를 마셔요.", extr: "I drink coffee in the morning.", status: "new", image: "k86 커피를 마시다" },
  { id: "k87", term: "아침/점심/저녁을 먹다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "achim/jeomsim/jeonyeogeul meokda", pron: "a-chim/jeom-sim/jeon-yeog-eul meok-da (approximate)", def: "To eat breakfast / lunch / dinner.", ex: "식당에서 점심을 먹어요.", extr: "I eat lunch at the restaurant.", status: "new", image: "k87 아침점심저녁을 먹다" },
  { id: "k88", term: "일하다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "ilhada", pron: "il-ha-da (approximate)", def: "To work.", ex: "회사에서 열심히 일해요.", extr: "I work hard at the company.", status: "new", image: "k88 일하다" },
  { id: "k89", term: "요리하다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "yorihada", pron: "yo-ri-ha-da (approximate)", def: "To cook.", ex: "부엌에서 요리를 합니다.", extr: "I cook in the kitchen.", status: "new", image: "k89 요리하다" },
  { id: "k90", term: "운동하다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "undonghada", pron: "un-dong-ha-da (approximate)", def: "To exercise / To work out.", ex: "공원에서 운동을 해요.", extr: "I exercise at the park.", status: "new", image: "k90 운동하다" },
  { id: "k91", term: "회사에 가다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "hoesae gada", pron: "hoe-sa-e ga-da (approximate)", def: "To go to work / To go to the company.", ex: "아침에 회사에 가요.", extr: "I go to work in the morning.", status: "new", image: "k91 회사에 가다" },
  { id: "k92", term: "집에 오다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "jibe oda", pron: "ji-be o-da (approximate)", def: "To come home.", ex: "일이 끝나고 집에 와요.", extr: "I come home after finishing work.", status: "new", image: "k92 집에 오다" },
  { id: "k93", term: "전화하다", pos: "Verb", level: "Beginner", category: "Daily Activities", cls: 7, roman: "jeonhwahada", pron: "jeon-hwa-ha-da (approximate)", def: "To make a phone call / To call.", ex: "친구에게 전화해요.", extr: "I call my friend[cite: 3].", status: "new", image: "k93 전화하다" },

  // Class 8
  { id: "k92", term: "지금", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "jigeum", pron: "ji-geum (approximate)", def: "Now.", ex: "지금 뭐 해요?", extr: "What are you doing now?", status: "new", image: "k92 지금" },
  { id: "k93", term: "오늘", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "oneul", pron: "o-neul (approximate)", def: "Today.", ex: "오늘 날씨가 좋아요.", extr: "The weather is good today.", status: "new", image: "k93 오늘" },
  { id: "k94", term: "어제", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "eoje", pron: "eo-je (approximate)", def: "Yesterday.", ex: "어제 친구를 만났어요.", extr: "I met a friend yesterday.", status: "new", image: "k94 어제" },
  { id: "k95", term: "내일", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "naeil", pron: "nae-il (approximate)", def: "Tomorrow.", ex: "내일 회사에 가요.", extr: "I am going to work tomorrow.", status: "new", image: "k95 내일" },
  { id: "k96", term: "오전", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "ojeon", pron: "o-jeon (approximate)", def: "AM / Morning.", ex: "오전에 운동을 해요.", extr: "I exercise in the morning.", status: "new", image: "k96 오전" },
  { id: "k97", term: "오후", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "ohu", pron: "o-hu (approximate)", def: "PM / Afternoon.", ex: "오후에 커피를 마셔요.", extr: "I drink coffee in the afternoon.", status: "new", image: "k97 오후" },
  { id: "k98", term: "낮", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "nat", pron: "nat (approximate)", def: "Day / Daytime.", ex: "낮에는 따뜻해요.", extr: "It is warm during the day.", status: "new", image: "k98 낮" },
  { id: "k99", term: "밤", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "bam", pron: "bam (approximate)", def: "Night.", ex: "밤에 별이 보여요.", extr: "I can see stars at night.", status: "new", image: "k99 밤" },
  { id: "k100", term: "새벽", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "saebyeok", pron: "sae-byeok (approximate)", def: "Dawn / Early morning.", ex: "새벽에 일어났어요.", extr: "I woke up at dawn.", status: "new", image: "k100 새벽" },
  { id: "k101", term: "아침", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "achim", pron: "a-chim (approximate)", def: "Morning / Breakfast.", ex: "아침을 먹어요.", extr: "I eat breakfast.", status: "new", image: "k101 아침" },
  { id: "k102", term: "점심", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "jeomsim", pron: "jeom-sim (approximate)", def: "Lunch / Noon.", ex: "점심에 냉면을 먹어요.", extr: "I eat naengmyeon for lunch.", status: "new", image: "k102 점심" },
  { id: "k103", term: "저녁", pos: "Noun", level: "Beginner", category: "Time", cls: 8, roman: "jeonyeok", pron: "jeo-nyeok (approximate)", def: "Evening / Dinner.", ex: "저녁을 준비해요.", extr: "I prepare dinner.", status: "new", image: "k103 저녁" },

  // Class 9
  { id: "k106", term: "사과", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "sagwa", pron: "sa-gwa (approximate)", def: "Apple.", ex: "사과를 먹어요.", extr: "I eat an apple.", status: "new" },
  { id: "k107", term: "오렌지", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "orenji", pron: "o-ren-ji (approximate)", def: "Orange.", ex: "오렌지를 좋아해요.", extr: "I like oranges.", status: "new" },
  { id: "k108", term: "밥", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "bap", pron: "bap (approximate)", def: "Cooked rice / Meal.", ex: "밥을 먹어요.", extr: "I eat a meal.", status: "new" },
  { id: "k109", term: "수박", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "subak", pron: "su-bak (approximate)", def: "Watermelon.", ex: "여름에 수박을 먹어요.", extr: "I eat watermelon in summer.", status: "new" },
  { id: "k110", term: "물", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "mul", pron: "mul (approximate)", def: "Water.", ex: "물을 마셔요.", extr: "I drink water.", status: "new" },
  { id: "k111", term: "주스", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "juseu", pron: "ju-seu (approximate)", def: "Juice.", ex: "주스를 마셔요.", extr: "I drink juice.", status: "new" },
  { id: "k112", term: "우유", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "uyu", pron: "u-yu (approximate)", def: "Milk.", ex: "우유를 마셔요.", extr: "I drink milk.", status: "new" },
  { id: "k113", term: "빵", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "ppang", pron: "ppang (approximate)", def: "Bread.", ex: "아침에 빵을 먹어요.", extr: "I eat bread in the morning.", status: "new" },
  { id: "k114", term: "라면", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "ramyeon", pron: "ra-myeon (approximate)", def: "Instant noodles / Ramen.", ex: "라면을 먹어요.", extr: "I eat ramen.", status: "new" },
  { id: "k115", term: "과자", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "gwaja", pron: "gwa-ja (approximate)", def: "Snack / Cookies.", ex: "과자를 먹어요.", extr: "I eat snacks.", status: "new" },
  { id: "k116", term: "초콜릿", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "chokollit", pron: "cho-kol-lit (approximate)", def: "Chocolate.", ex: "초콜릿을 좋아해요.", extr: "I like chocolate.", status: "new" },
  { id: "k117", term: "아이스크림", pos: "Noun", level: "Beginner", category: "Food", cls: 9, roman: "aiseukeurim", pron: "a-i-seu-keu-rim (approximate)", def: "Ice cream.", ex: "아이스크림을 먹어요.", extr: "I eat ice cream.", status: "new" },

  // Class 10
  { id: "k118", term: "돈", pos: "Noun", level: "Beginner", category: "Shopping", cls: 10, roman: "don", pron: "don (approximate)", def: "Money / Cash.", ex: "돈이 없어요.", extr: "I have no money.", status: "new" },
  { id: "k119", term: "동전", pos: "Noun", level: "Beginner", category: "Shopping", cls: 10, roman: "dongjeon", pron: "dong-jeon (approximate)", def: "Coin.", ex: "동전이 있어요.", extr: "I have a coin.", status: "new" },
  { id: "k120", term: "지폐", pos: "Noun", level: "Beginner", category: "Shopping", cls: 10, roman: "jipye", pron: "ji-pye (approximate)", def: "Banknote / Paper money.", ex: "지폐로 계산해요.", extr: "I pay with paper money.", status: "new" },
  { id: "k121", term: "신용카드", pos: "Noun", level: "Beginner", category: "Shopping", cls: 10, roman: "sinyongkadeu", pron: "sin-yong-ka-deu (approximate)", def: "Credit card.", ex: "신용카드로 계산해요.", extr: "I pay with a credit card.", status: "new" },
  { id: "k122", term: "값", pos: "Noun", level: "Beginner", category: "Shopping", cls: 10, roman: "gap", pron: "gap (approximate)", def: "Price.", ex: "값이 얼마예요?", extr: "How much is the price?", status: "new" },
  { id: "k123", term: "싸다", pos: "Adjective", level: "Beginner", category: "Shopping", cls: 10, roman: "ssada", pron: "ssa-da (approximate)", def: "Cheap.", ex: "이 신발은 싸요.", extr: "These shoes are cheap.", status: "new" },
  { id: "k124", term: "비싸다", pos: "Adjective", level: "Beginner", category: "Shopping", cls: 10, roman: "bissada", pron: "bi-ssa-da (approximate)", def: "Expensive.", ex: "이 가방은 비싸요.", extr: "This bag is expensive.", status: "new" },
  { id: "k125", term: "깎다", pos: "Verb", level: "Beginner", category: "Shopping", cls: 10, roman: "kkakda", pron: "kkak-da (approximate)", def: "To bargain / To get a discount.", ex: "값을 깎아 주세요.", extr: "Please give me a discount.", status: "new" },
  { id: "k126", term: "넣다", pos: "Verb", level: "Beginner", category: "Shopping", cls: 10, roman: "neota", pron: "neo-ta (approximate)", def: "To put in.", ex: "가방에 책을 넣어요.", extr: "I put a book in the bag.", status: "new" },
  { id: "k127", term: "포장하다", pos: "Verb", level: "Beginner", category: "Shopping", cls: 10, roman: "pojanghada", pron: "po-jang-ha-da (approximate)", def: "To wrap / To pack.", ex: "선물을 포장해 주세요.", extr: "Please wrap the gift.", status: "new" },
  { id: "k128", term: "바꾸다", pos: "Verb", level: "Beginner", category: "Shopping", cls: 10, roman: "bakkuda", pron: "ba-kku-da (approximate)", def: "To change / To exchange.", ex: "신발을 바꿔요.", extr: "I exchange the shoes.", status: "new" },
  { id: "k129", term: "환불하다", pos: "Verb", level: "Beginner", category: "Shopping", cls: 10, roman: "hwanbulhada", pron: "hwan-bul-ha-da (approximate)", def: "To refund / To get a refund.", ex: "환불해 주세요.", extr: "Please give me a refund.", status: "new" },

  // Class 11
  { id: "k130", term: "옷", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "ot", pron: "ot (approximate)", def: "Clothes.", ex: "옷이 예뻐요.", extr: "The clothes are pretty.", status: "new" },
  { id: "k131", term: "바지", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "baji", pron: "ba-ji (approximate)", def: "Pants / Trousers.", ex: "바지를 입어요.", extr: "I wear pants.", status: "new" },
  { id: "k132", term: "티셔츠", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "tisyeocheu", pron: "ti-syeo-cheu (approximate)", def: "T-shirt.", ex: "티셔츠를 입어요.", extr: "I wear a T-shirt.", status: "new" },
  { id: "k133", term: "잠바", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "jamba", pron: "jam-ba (approximate)", def: "Jacket / Jumper.", ex: "잠바를 입어요.", extr: "I wear a jacket.", status: "new" },
  { id: "k134", term: "운동화", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "undonghwa", pron: "un-dong-hwa (approximate)", def: "Sneakers.", ex: "운동화를 신어요.", extr: "I wear sneakers.", status: "new" },
  { id: "k135", term: "구두", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "gudu", pron: "gu-du (approximate)", def: "Dress shoes.", ex: "구두를 신어요.", extr: "I wear dress shoes.", status: "new" },
  { id: "k136", term: "슬리퍼", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "seullipeo", pron: "seul-li-peo (approximate)", def: "Slippers.", ex: "집에서 슬리퍼를 신어요.", extr: "I wear slippers at home.", status: "new" },
  { id: "k137", term: "장화", pos: "Noun", level: "Beginner", category: "Clothing", cls: 11, roman: "janghwa", pron: "jang-hwa (approximate)", def: "Rain boots.", ex: "비가 오면 장화를 신어요.", extr: "I wear rain boots when it rains.", status: "new" },
  { id: "k138", term: "입다", pos: "Verb", level: "Beginner", category: "Clothing", cls: 11, roman: "ipda", pron: "ip-da (approximate)", def: "To wear (clothes).", ex: "오늘은 잠바를 입었어요.", extr: "I wore a jacket today.", status: "new" },

  // Class 12
  { id: "k139", term: "양말", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "yangmal", pron: "yang-mal (approximate)", def: "Socks.", ex: "양말을 신어요.", extr: "I wear socks.", status: "new" },
  { id: "k140", term: "장갑", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "janggap", pron: "jang-gap (approximate)", def: "Gloves.", ex: "겨울에 장갑을 껴요.", extr: "I wear gloves in winter.", status: "new" },
  { id: "k141", term: "목도리", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "mokdori", pron: "mok-do-ri (approximate)", def: "Scarf.", ex: "목도리를 해요.", extr: "I wear a scarf.", status: "new" },
  { id: "k142", term: "넥타이", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "nektai", pron: "nek-ta-i (approximate)", def: "Necktie.", ex: "넥타이를 매요.", extr: "I wear a tie.", status: "new" },
  { id: "k143", term: "안경", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "angyeong", pron: "an-gyeong (approximate)", def: "Glasses.", ex: "안경을 써요.", extr: "I wear glasses.", status: "new" },
  { id: "k144", term: "선글라스", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "seongeullaseu", pron: "seon-geul-la-seu (approximate)", def: "Sunglasses.", ex: "선글라스를 써요.", extr: "I wear sunglasses.", status: "new" },
  { id: "k145", term: "반지", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "banji", pron: "ban-ji (approximate)", def: "Ring.", ex: "반지를 좋아해요.", extr: "I like rings.", status: "new" },
  { id: "k146", term: "목걸이", pos: "Noun", level: "Beginner", category: "Accessories", cls: 12, roman: "mokgeori", pron: "mok-geo-ri (approximate)", def: "Necklace.", ex: "목걸이가 예뻐요.", extr: "The necklace is pretty.", status: "new" },
  { id: "k147", term: "신다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "sinda", pron: "sin-da (approximate)", def: "To wear (on the feet).", ex: "신발을 신어요.", extr: "I put on shoes.", status: "new" },
  { id: "k148", term: "끼다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "kkida", pron: "kki-da (approximate)", def: "To wear (gloves, rings).", ex: "장갑을 꼈어요.", extr: "I wore gloves.", status: "new" },
  { id: "k149", term: "하다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "hada", pron: "ha-da (approximate)", def: "To wear (a scarf or accessory).", ex: "목걸이를 했어요.", extr: "I wore a necklace.", status: "new" },
  { id: "k150", term: "쓰다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "sseuda", pron: "sseu-da (approximate)", def: "To wear (on the head or face).", ex: "모자를 써요.", extr: "I wear a hat.", status: "new" },
  { id: "k151", term: "매다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "maeda", pron: "mae-da (approximate)", def: "To tie / To wear (a tie).", ex: "신발 끈을 매요.", extr: "I tie my shoelaces.", status: "new" },
  { id: "k152", term: "메다", pos: "Verb", level: "Beginner", category: "Accessories", cls: 12, roman: "meda", pron: "me-da (approximate)", def: "To carry (on the shoulder).", ex: "가방을 메요.", extr: "I carry a bag on my shoulder.", status: "new" },

  // Class 13
  { id: "k153", term: "위", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "wi", pron: "wi (approximate)", def: "Up / Above / On top.", ex: "책상 위에 책이 있어요.", extr: "There is a book on the desk.", status: "new" },
  { id: "k154", term: "아래", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "arae", pron: "a-rae (approximate)", def: "Under / Below.", ex: "의자 아래에 가방이 있어요.", extr: "There is a bag under the chair.", status: "new" },
  { id: "k155", term: "앞", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "ap", pron: "ap (approximate)", def: "Front / In front.", ex: "학교 앞에 있어요.", extr: "It is in front of the school.", status: "new" },
  { id: "k156", term: "뒤", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "dwi", pron: "dwi (approximate)", def: "Back / Behind.", ex: "집 뒤에 나무가 있어요.", extr: "There is a tree behind the house.", status: "new" },
  { id: "k157", term: "안", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "an", pron: "an (approximate)", def: "Inside.", ex: "가방 안에 책이 있어요.", extr: "There is a book inside the bag.", status: "new" },
  { id: "k158", term: "밖", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "bak", pron: "bak (approximate)", def: "Outside.", ex: "문 밖에 있어요.", extr: "It is outside the door.", status: "new" },
  { id: "k159", term: "오른쪽", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "oreunjjok", pron: "o-reun-jjok (approximate)", def: "Right side.", ex: "은행은 오른쪽에 있어요.", extr: "The bank is on the right.", status: "new" },
  { id: "k160", term: "왼쪽", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "oenjjok", pron: "oen-jjok (approximate)", def: "Left side.", ex: "화장실은 왼쪽에 있어요.", extr: "The restroom is on the left.", status: "new" },
  { id: "k161", term: "건너편", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "geonneopyeon", pron: "geon-neo-pyeon (approximate)", def: "The opposite side / Across.", ex: "은행은 건너편에 있어요.", extr: "The bank is across the street.", status: "new" },
  { id: "k162", term: "옆", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "yeop", pron: "yeop (approximate)", def: "Beside / Next to.", ex: "친구 옆에 앉아요.", extr: "I sit next to my friend.", status: "new" },
  { id: "k163", term: "사이", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "sai", pron: "sa-i (approximate)", def: "Between.", ex: "학교와 집 사이에 있어요.", extr: "It is between the school and the house.", status: "new" },
  { id: "k164", term: "가운데", pos: "Noun", level: "Beginner", category: "Positions", cls: 13, roman: "gaunde", pron: "ga-un-de (approximate)", def: "Middle / Center.", ex: "책상 가운데에 있어요.", extr: "It is in the middle of the desk.", status: "new" },

  // Class 14
  { id: "k165", term: "도청", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "docheong", pron: "do-cheong (approximate)", def: "Provincial government office.", ex: "도청에서 일해요.", extr: "I work at the provincial office.", status: "new" },
  { id: "k166", term: "시청", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "sicheong", pron: "si-cheong (approximate)", def: "City hall.", ex: "시청에 가요.", extr: "I go to city hall.", status: "new" },
  { id: "k167", term: "구청", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "gucheong", pron: "gu-cheong (approximate)", def: "District office.", ex: "구청에서 서류를 받아요.", extr: "I get documents at the district office.", status: "new" },
  { id: "k168", term: "경찰서", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "gyeongchalseo", pron: "gyeong-chal-seo (approximate)", def: "Police station.", ex: "경찰서가 가까워요.", extr: "The police station is close.", status: "new" },
  { id: "k169", term: "소방서", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "sobangseo", pron: "so-bang-seo (approximate)", def: "Fire station.", ex: "소방서 앞에 소방차가 있어요.", extr: "There is a fire truck in front of the fire station.", status: "new" },
  { id: "k170", term: "출입국관리사무소", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "churipgukgwallisamuso", pron: "chu-rip-guk-gwal-li-sa-mu-so (approximate)", def: "Immigration office.", ex: "출입국관리사무소에 가요.", extr: "I go to the immigration office.", status: "new" },
  { id: "k171", term: "보건소", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "bogeonso", pron: "bo-geon-so (approximate)", def: "Public health center.", ex: "보건소에서 주사를 맞아요.", extr: "I get a shot at the public health center.", status: "new" },
  { id: "k172", term: "주민센터", pos: "Noun", level: "Beginner", category: "Public Offices", cls: 14, roman: "jumin senteo", pron: "ju-min sen-teo (approximate)", def: "Community center.", ex: "주민센터에서 서류를 떼요.", extr: "I get documents at the community center.", status: "new" },

  // Class 15
  { id: "k173", term: "빠르다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "ppareuda", pron: "ppa-reu-da (approximate)", def: "Fast / Quick (also: early).", ex: "기차는 빨라요.", extr: "The train is fast.", status: "new" },
  { id: "k174", term: "늦다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "neutda", pron: "neut-da (approximate)", def: "Late / Slow.", ex: "늦어서 미안해요.", extr: "I'm sorry I'm late.", status: "new" },
  { id: "k175", term: "가깝다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "gakkapda", pron: "gak-kap-da (approximate)", def: "Near / Close.", ex: "학교가 가까워요.", extr: "The school is near.", status: "new" },
  { id: "k176", term: "멀다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "meolda", pron: "meol-da (approximate)", def: "Far.", ex: "집이 멀어요.", extr: "My house is far.", status: "new" },
  { id: "k177", term: "같다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "gatda", pron: "gat-da (approximate)", def: "Same / Alike.", ex: "우리는 나이가 같아요.", extr: "We are the same age.", status: "new" },
  { id: "k178", term: "다르다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "dareuda", pron: "da-reu-da (approximate)", def: "Different.", ex: "색깔이 달라요.", extr: "The colors are different.", status: "new" },
  { id: "k179", term: "간단하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "gandanhada", pron: "gan-dan-ha-da (approximate)", def: "Simple / Easy.", ex: "이 문제는 간단해요.", extr: "This problem is simple.", status: "new" },
  { id: "k180", term: "복잡하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "bokjapada", pron: "bok-ja-pa-da (approximate)", def: "Complicated / Crowded.", ex: "지하철이 복잡해요.", extr: "The subway is crowded.", status: "new" },
  { id: "k181", term: "편하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "pyeonhada", pron: "pyeon-ha-da (approximate)", def: "Comfortable / Convenient.", ex: "이 의자는 편해요.", extr: "This chair is comfortable.", status: "new" },
  { id: "k182", term: "불편하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "bulpyeonhada", pron: "bul-pyeon-ha-da (approximate)", def: "Uncomfortable / Inconvenient.", ex: "이 신발은 불편해요.", extr: "These shoes are uncomfortable.", status: "new" },
  { id: "k183", term: "가능하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "ganeunghada", pron: "ga-neung-ha-da (approximate)", def: "Possible.", ex: "내일 가능해요?", extr: "Is tomorrow possible?", status: "new" },
  { id: "k184", term: "불가능하다", pos: "Adjective", level: "Beginner", category: "Adjectives", cls: 15, roman: "bulganeunghada", pron: "bul-ga-neung-ha-da (approximate)", def: "Impossible.", ex: "오늘은 불가능해요.", extr: "Today is impossible.", status: "new" },


];

