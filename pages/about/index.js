import Head from 'next/head';
import Image from 'next/image';
import img1 from '../../public/images/contactsInfo/img2.jpg';
import img2 from '../../public/images/contactsInfo/img4.jpg';
import img3 from '../../public/images/contactsInfo/img5.jpg';
import s from './index.module.scss';

export default function AboutPage() {
  return <main className={s.page}>
    <Head><title>Ансамбль Сирин — О нас</title><meta name='description' content='История и достижения хореографического ансамбля «Сирин»' /></Head>
    <section className={s.hero}>
      <div><span className={s.kicker}>ОБРАЗЦОВЫЙ ХОРЕОГРАФИЧЕСКИЙ АНСАМБЛЬ</span><h1>МЫ — СИРИН</h1><p>Танцуем, растём и создаём сценические истории вместе с 2002 года.</p></div>
      <Image src={img1} alt='Ансамбль «Сирин»' priority />
    </section>
    <section className={s.story}>
      <div><span className={s.number}>01</span><h2>Наша история</h2></div>
      <div className={s.copy}><p>Хореографический ансамбль «Сирин» был основан в 2002 году в Центральном доме детей железнодорожников. В 2011 году коллектив переехал в Дом культуры «Гайдаровец».</p><p>Сегодня ансамбль объединяет детей, педагогов и выпускников, для которых танец стал важной частью жизни.</p></div>
    </section>
    <section className={s.imageRow}><Image src={img2} alt='Выступление ансамбля' /><Image src={img3} alt='Участники ансамбля' /></section>
    <section className={s.story}>
      <div><span className={s.number}>02</span><h2>Конкурсы и фестивали</h2></div>
      <div className={s.copy}><p>Ансамбль — участник и лауреат международных и всероссийских конкурсов и фестивалей. Коллектив выступает на городских площадках Москвы и гастролирует по России и ближнему зарубежью.</p><p>Кострома, Суздаль, Санкт-Петербург, Йошкар-Ола, Ярославль, Севастополь, Сочи, Адлер, Петрозаводск, Минск, Туапсе и Крым — лишь часть нашей сценической географии.</p></div>
    </section>
    <section className={s.blue}><h2>Наши дети — состоявшиеся артисты</h2><p>Педагоги ансамбля помогают воспитанникам развить технику, артистизм, дисциплину и подготовиться к поступлению в профильные учебные заведения.</p></section>
  </main>;
}
