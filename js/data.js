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


];