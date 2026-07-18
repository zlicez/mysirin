// Components
import Header from "../components/main/Header/Header";
import Preview from "../components/main/Preview/Preview";
import About from "../components/main/About/About";
import Advantages from "../components/main/Advantages/Advantages";
import Rules from "../components/main/Rules/Rules";
import Video from "../components/main/Video/Video";
import Team from "../components/main/Team/Team";
import Reviews from "../components/main/Reviews/Reviews";
import Contact from "../components/main/Contacts/Contact";
import Footer from "../components/Footer/Footer";
import Menu from "../components/main/Menu/Menu";
// Form
import { Provider } from "react-redux";
import { setupStore } from "../src/store/store";

// for SSR
import { wrapper } from "../src/store/store";
import { fetchAllTeam } from "../src/team/teamService";
import { fetchContact } from "../src/contacts/contacts";
import { getReviews } from "../src/reviews/reviews";
import Head from "next/head";
import FormWrapper from "../components/FormWrapper/FormWrapper";
import { fetchHomeSlides, fetchHomeVideo } from "../src/home/home";

// SSR for team
export const getServerSideProps = wrapper.getServerSideProps(
	(store) => async (context) => {
		const [team, contacts, reviews, homeVideo, homeSlides] = await Promise.all([
			store.dispatch(fetchAllTeam.initiate()),
			store.dispatch(fetchContact.initiate()),
			store.dispatch(getReviews.initiate()),
			store.dispatch(fetchHomeVideo.initiate()),
			store.dispatch(fetchHomeSlides.initiate()),
		]);

		return {
			props: {
				team: !team.isError && team.data,
				contacts: !contacts.isError && contacts.data,
				reviews: !reviews.isError && reviews.data,
				teamError: team.isError && team.error,
				contactsError: contacts.isError && contacts.error,
				reviewsError: contacts.isError && contacts.error,
				homeVideo: !homeVideo?.isError ? homeVideo?.data?.[0] || null : null,
				homeSlides: !homeSlides?.isError ? homeSlides?.data || [] : []
			},
		};
	},
);

export default function Home({
	team,
	contacts,
	reviews,
	teamError,
	contactsError,
	reviewsError,
	homeVideo,
	homeSlides
}) {
	return (
		<div className="component">
			<Head>
				<title>Сирин - образцовый хореографический ансамбль</title>
			</Head>
			<Menu />
			<Preview slides={homeSlides} />
			<About />
			<Advantages />
			<Rules />
			{/*
				homeVideo.url_video &&
				<Video url={homeVideo.url_video} />
			*/}
			<Team team={team} error={teamError} />
			<Reviews reviews={reviews} error={reviewsError} />
			<Contact contacts={contacts} error={contactsError} />
		</div>
	);
}

Home.getLayout = function PageLayout(page) {
	const store = setupStore();
	return (
		<Provider store={store}>
			<Header />
			<FormWrapper />
			{page}
			<Footer />
		</Provider>
	);
};
