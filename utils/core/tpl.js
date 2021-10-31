spinner.start(dim(`Fetching LearnWithJason schedule…`));
	const [err, res] = await to(axios.get(apiURL));
	handleError(`API CALL FAILED`, err, true, true);

	const schedule = res.data.map(({ title, description, slug, guest }) => {
		return {
			title,
			description,
			guestName: guest[0].name,
			link: `https://www.learnwithjason.dev/${slug.current}`
		};
	});
	spinner.stop();

	schedule.map(({ title, description, link, guestName }, index) => {
		console.log(
			`${dim(`#${++index}`)} ${title} ${dim(`with`)} ${red(guestName)}`
		);
		console.log(dim(`❯❯ ${link}`));
		console.log();
		console.log(dim(description));
		console.log();
		console.log();
	});