import React from 'react'
import { navigate } from '@reach/router'
import pf from 'petfinder-client'
import Carousel from './Carousel'
import Modal from './Modal'

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

class Details extends React.Component {
  state = {
    loading: true,
    showModal: false,
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal })

  componentDidMount() {
    petfinder.pet
      .get({
        output: 'full',
        id: this.props.id,
      })
      .then((data) => {
        let breed
        if (Array.isArray(data.petfinder.pet.breeds.breed)) {
          breed = data.petfinder.pet.breeds.breed.join(', ')
        } else {
          breed = data.petfinder.pet.breeds.breed
        }
        this.setState({
          name: data.petfinder.pet.name,
          animal: data.petfinder.pet.animal,
          location: `${data.petfinder.pet.contact.city}, ${data.petfinder.pet.contact.state}`,
          description: data.petfinder.pet.description,
          media: data.petfinder.pet.media,
          breed,
          loading: false,
        })
      })
      .catch(() => {
        navigate('/')
      })
  }

  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>
    }

    const { media, animal, breed, location, description, name, showModal } = this.state

    return (
      <div className='details'>
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} — ${breed} — ${location}`}</h2>
          <button onClick={this.toggleModal}>Adopt this chap?</button>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <h1>Would you really like to adopt this chap?</h1>
              <button onClick={this.toggleModal}>Yes</button>
            </Modal>
          ) : null}
        </div>
      </div>
    )
  }
}

export default Details
