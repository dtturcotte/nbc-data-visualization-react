import React from 'react'
import '../../scss/global.scss'
import '../../scss/header.scss'

interface Props {
	pathname: string
}

interface NavItem {
	display: string
	link: string
}

interface State {
	nav: NavItem[]
}

class Header extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			nav: [
				{
					display: 'dashboard',
					link: '/',
				},
			],
		}
	}

	componentDidMount(): void {}

	componentWillUnmount(): void {}

	render() {
		return (
			<>
				<nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
					<div className="container">
						<div>
							<a href="/">
								<img className="logo" src="assets/logo.png" />
							</a>
						</div>
						<button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#n_bar" aria-controls="navbarNavAltMarkup" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="n_bar">
							<ul className="navbar-nav">
								{this.state.nav.map((n, index) => {
									return (
										<li key={index} className={`nav-item ms-md-5`}>
											<a className={`nav-link ${this.props.pathname === n.link ? 'active' : ''}`} href={n.link} target={n.link.includes('https') ? '_blank' : '_self'}>
												{n.display}
											</a>
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</nav>
				<div className="heading-spacer"></div>
			</>
		)
	}
}

export default Header
