import React from 'react'
import '../../scss/global.scss'

interface Props {}

interface State {
	stories: any
}

class Stories extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			stories: [
				{
					title: 'Israel-Palestine',
				},
				{
					title: 'Food Engineering',
				},
				{
					title: 'Senate Latest',
				},
				{
					title: 'Top Games 2023',
				},
			],
		}
	}

	componentDidMount(): void {}

	componentWillUnmount(): void {}

	render() {
		return (
			<>
				<div className="section bg-dark">
					<div className="container py-4">
						<div className="row gx-5 center-text">
							<h3>Latest Stories</h3>
							<hr className="style-one" />
							{this.state.stories.map((obj: any, index: number) => {
								return (
									<div className="col-sm-3" key={index}>
										<h5>{obj.title}</h5>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default Stories
