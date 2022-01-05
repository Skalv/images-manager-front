import { Button, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8787/projects')
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true)
          setProjects(result)
        }, error => {
          setIsLoaded(true)
          setError(error)
        })
  }, [])

  return (
    <Container>
      <Row>
        <h1>Mes projets</h1>
      </Row>
      <Row>
        {error && <p>Erreur : {error.message}</p>}
        {!isLoaded && <p>Chargement ...</p>}

        {
          projects.map((projet) => {
            return (
              <Link key={projet} href={`projects/${projet}`} >
                <a>{projet}</a>
              </Link>
            )
          })
        }

      </Row>
    </Container>
  )
}
