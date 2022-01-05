import { Button, Container, Row, CardGroup, Card, Modal, Col, Form, CardImg } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const ProxyUrl = "https://api-proxy.skalvstudio.workers.dev/corsproxy/"
const APIURL = `${ProxyUrl}?apiurl=https://api.cloudflare.com/client/v4/accounts/70dec78a5939454a8fcd8c8fa205f00e/images/v1`


function copyOnClick(text) {
  navigator.clipboard.writeText(text)
}

function AddModal() {
  const [show, setShow] = useState(false)
  const [projectName, setProjectName] = useState(null)
  const [images, setImages] = useState(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("metadata", `{ "project": "${projectName}" }`)
    formData.append("file", images[0])

    fetch(APIURL, {
      method: "POST",
      headers: new Headers({
        "X-Auth-Email": "fboutin@skalv-studio.fr",
        "X-Auth-Key": APIKEY,
      }),
      body: formData
    }).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })

  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add new Images
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add new images to CF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Project name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cutepoop"
                onChange={(e) => setProjectName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Select images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default function Home() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch(`${APIURL}`, {
      method: "get",
      headers: new Headers({
        "X-Auth-Email": "fboutin@skalv-studio.fr",
        "X-Auth-Key": APIKEY,
        "Content-Type": "application/json"
      })
    }).then(res => res.json())
      .then(
        result => {
          setImages(result.result.images)
          setIsLoaded(true)
        }, error => {
          setIsLoaded(true)
          setError(error)
        })
  }, [])



  return (
    <Container>
      <Row>
        <Col>
          <h1>Image managers</h1>
          {error && <p>Erreur : {error.message}</p>}
          {!isLoaded && <p>Chargement ...</p>}
        </Col>
        <Col>
          <AddModal />
        </Col>
      </Row>
      <Row>
        {
          images.map((image) => {
            return (
              <Col key={image.id}>
                <Card>
                  <Card.Img variant="top" src={image.variants[0]} />
                  <Card.Body>
                    <Card.Title onClick={() => copyOnClick(image.filename)}>{image.filename}</Card.Title>
                    <Card.Text>
                      {image.meta && <p>{image.meta.project}</p>}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )
          })
        }
      </Row>

    </Container>
  )
}
