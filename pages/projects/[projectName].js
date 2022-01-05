import { Button, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Projects() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetch(`http://127.0.0.1:8787/projects/${router.query.projectName}`)
      .then(res => res.json())
      .then(
        result => {
          console.log(result)
          setIsLoaded(true)
          setImages(result)
        }, error => {
          setIsLoaded(true)
          setError(error)
        })
  }, [])

  return (
    <Container>
      <Row>
        <h1>Images de {router.query.projectName}</h1>
      </Row>
      <Row>
        {error && <p>Erreur : {error.message}</p>}
        {!isLoaded && <p>Chargement ...</p>}

        {
          images.map((image) => {
            return (
              <Link href={`images/${image.data.name}`} key={image.ref['@ref'].id}>{image.data.name}</Link>
            )
          })
        }

      </Row>
    </Container>
  )
}
