import React from "react"
import {
	Carousel,
	CarouselItem,
	CarouselControl,
	CarouselIndicators,
} from "reactstrap"

/**
 * Function component for an image carousel.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const ImageCarousel = props => {
	// State to keep track of the active index and animation status
	const [activeIndex, setActiveIndex] = React.useState(0)
	const [animating, setAnimating] = React.useState(false)

	// Set the active index when the component mounts
	React.useEffect(() => {
		setActiveIndex(props.currentIndex)
	}, [])

	// Function to go to the next image in the carousel
	const next = () => {
		if (animating) return
		const nextIndex =
			activeIndex === props.images.length - 1 ? 0 : activeIndex + 1
		setActiveIndex(nextIndex)
	}

	// Function to go to the previous image in the carousel
	const previous = () => {
		if (animating) return
		const nextIndex =
			activeIndex === 0 ? props.images.length - 1 : activeIndex - 1
		setActiveIndex(nextIndex)
	}

	// Function to go to a specific image index in the carousel
	const goToIndex = newIndex => {
		if (animating) return
		setActiveIndex(newIndex)
	}

	// Helper function to set the animating value
	const setAnimatingValue = value => {
		setAnimating(value)
	}

	// Create carousel slides based on the images array
	const slides = props.images.map((image, key) => (
		<CarouselItem
			onExiting={() => setAnimatingValue(true)}
			onExited={() => setAnimatingValue(false)}
			key={key}>
			<div className="d-flex justify-content-center">
				<img src={image} alt={image} className="img-fluid" />
			</div>
		</CarouselItem>
	))

	return (
		<Carousel
			className="modal-image-carousel"
			activeIndex={activeIndex}
			next={next}
			previous={previous}>
			<CarouselIndicators
				items={props.images}
				activeIndex={activeIndex}
				onClickHandler={goToIndex}
			/>
			{slides}
			{props.images.length > 1 && (
				<>
					<CarouselControl
						direction="prev"
						directionText="Previous"
						onClickHandler={previous}
					/>
					<CarouselControl
						direction="next"
						directionText="Next"
						onClickHandler={next}
					/>
				</>
			)}
		</Carousel>
	)
}

export default ImageCarousel
