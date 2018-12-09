import React from 'react'
import { View, Button, TouchableOpacity, Animated, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import MenuOptions from './MenuOptions'
import { Coordinate, Layout } from '../../../../utility';
import ExitEditModeButton from './ExitEditModeButton'
import MenuButton from './MenuButton'
import { EditModeContext, UserTaskContext } from './../../Context'


export interface Optionable {
	title: string,
	handler: (cb: () => void) => void
}


interface PopupMenuProps {
	date : string | null // We need this for binding of the context functions
	options : Optionable[]
}

interface PopupMenuState {
	location: Coordinate,
	dimensions: Layout,
	isVisible: boolean
}

export default class PopupMenu extends React.Component<PopupMenuProps, PopupMenuState>{
	menu: React.RefObject<any>
	popup_content: React.RefObject<any>

	constructor(props: PopupMenuProps) {
		super(props)

		this.menu = React.createRef()
		this.popup_content = React.createRef()

		this.state = {
			location: { x: 0, y: 0 },
			dimensions: { x: 0, y: 0, width: 0, height: 0 },
			isVisible: false
		}


	}


	componentDidMount() {
	}

	componentWillUnmount() {
		console.log("Popupmenu unmounted");
	}

	toggleMenu = (state?: boolean) => {
		if (!this.state.isVisible) {
			Promise.all([
				new Promise((resolve) => {
					this.menu.current.measure((x, y, width, height, pageX, pageY) => {
						const location = { x: pageX, y: pageY }
						this.setState({
							location: location
						}, resolve)
					})
				}),
				new Promise((resolve) => {
					//If the dimensions havent been measured yet
					if (this.state.dimensions.width === 0 && this.state.dimensions.height === 0) {
						this.popup_content.current.measure((x, y, width, height, pageX, pageY) => {
							const dimensions = {
								x: x,
								y: y,
								width: width,
								height: height
							} as Layout
							// console.log("measured to be", dimensions);
							this.setState({
								dimensions: dimensions
							}, resolve)
						})
					}
					else
						resolve()
				})
			]).then(() => {
				this.setState({
					isVisible: (state) ? state : !this.state.isVisible
				})
			})
		}
		else {
			this.setState({
				isVisible: !this.state.isVisible
			})
		}
	}


	render() {
		return <UserTaskContext.Consumer>
			{
				({deallocateTasksFromDate} : any) => {
					return <EditModeContext.Consumer>
						{
							({ isEditMode, toggleEditMode }: any) => {

								// Read from context and bind the context function to the options
								for (let option of this.props.options) {
									if (option.title === "Edit") {
										option.handler = toggleEditMode
									}
									else if(option.title === "Clear List"){
										const boundHandler = (cb:()=>void)=>{
											deallocateTasksFromDate(this.props.date, cb)
										}
										option.handler = boundHandler
									}
								}

								return (
									<View ref={this.menu}>
										{
											isEditMode ?
												<ExitEditModeButton onPress={() => toggleEditMode()} /> :
												<MenuButton onPress={this.toggleMenu.bind(this, true)} />
										}

										{/* POPUP MENU CONTENT */}
										<View ref={this.popup_content} >
											<Modal
												animationIn={"fadeIn"}
												animationOut={"fadeOut"}
												style={{ margin: 0, position: "absolute", width: "100%", height: "100%" }}
												backdropOpacity={0.2}
												onBackdropPress={this.toggleMenu.bind(this, false)}
												isVisible={this.state.isVisible}>

												<View style={{
													margin: 0,
													position: "absolute",
													justifyContent: "center",
													alignItems: "center",
													top: this.state.location.y,
													left: this.state.location.x - 100,
													backgroundColor: "white",
													shadowOpacity: 0.5, shadowColor: "black",
													shadowOffset: { width: 5, height: 5 },
													shadowRadius: 3
												}}>

													<MenuOptions onChooseOption={this.toggleMenu} options={this.props.options} />
												</View>

											</Modal>
										</View>
									</View>
								)
							}}
					</EditModeContext.Consumer>
				}
			}
		</UserTaskContext.Consumer>
	}
}