import { Button, Container, Row, CardGroup, Card, Modal, Col, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function AddModal() {
  const [show, setShow] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [images, setImages] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!images) return

    setUploading(true)

    const metadatas = {
      project: projectName,
      collection: collectionName
    }

    Promise.all(
      Array.from(images).map(image => {
        const formData = new FormData()
        formData.append("metadata", JSON.stringify(metadatas))
        formData.append("file", image)

        return fetch(process.env.API_URL, {
          method: "POST",
          headers: new Headers({
            "X-Auth-Email": process.env.CF_API_EMAIL,
            "X-Auth-Key": process.env.CF_API_KEY,
          }),
          body: formData
        })
      })
    ).then(response => {
      console.log(response)
      setUploading(false)
    }).catch(err => {
      setUploading(false)
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Collection name</Form.Label>
              <Form.Control
                type="text"
                placeholder="backgrounds"
                onChange={(e) => setCollectionName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Select images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={uploading}>
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

function UpdateModal(props) {
  const [show, setShow] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    if (props.image.meta) {
      setProjectName(props.image.meta.project)
      setCollectionName(props.image.meta.collection)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoaded(true)

    const datas = {
      metadata: {
        project: projectName,
        collection: collectionName
      }
    }

    fetch(`${process.env.API_URL}/${props.image.id}`, {
      method: "PATCH",
      headers: new Headers({
        "X-Auth-Email": process.env.CF_API_EMAIL,
        "X-Auth-Key": process.env.CF_API_KEY,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(datas)
    })
    .then(res => res.json())
    .then(response => {
      console.log(response)
      setIsLoaded(false)
    })
    .catch(err => {
      console.log(err)
      setIsLoaded(false)
    })
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Update Project
      </Button>

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Update project name of {props.image.filename}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Project name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cutepoop"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Collection name</Form.Label>
              <Form.Control
                type="text"
                placeholder="backgrounds"
                onChange={(e) => setCollectionName(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoaded}>
              Update
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

  function deleteImage(image) {
    if(confirm(`Supprimer ${image.filename} ?`)) {
      setIsLoaded(true)
      fetch(`${process.env.API_URL}/${image.id}`, {
        method: "delete",
        headers: new Headers({
          "X-Auth-Email": process.env.CF_API_EMAIL,
          "X-Auth-Key": process.env.CF_API_KEY,
          "Content-Type": "application/json"
        })
      })
      .then(res => res.json())
      .then(response => {
        console.log(response)
        setIsLoaded(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoaded(false)
      })
    }
  }

  function exportNameId() {
    const exportDatas = Array.from(images)
    .filter(image => {
      return (image.meta && image.meta.project === "Pathfinder" && image.meta.collection === "Rarity")
    }).map(image => {
      return {
        [image.filename]: image.id
      }
    })

    console.log(exportDatas)
  }

  function copyOnClick(text) {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    if (isLoaded) return

    fetch(`${process.env.API_URL}`, {
      method: "get",
      headers: new Headers({
        "X-Auth-Email": process.env.CF_API_EMAIL,
        "X-Auth-Key": process.env.CF_API_KEY,
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
  }, [isLoaded])

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
          <Button onClick={() => exportNameId()}>Export Name/id List</Button>
        </Col>
      </Row>
      <Row xs={2} sm={4} lg={8}>
        {
          images.map((image) => {
            return (
              <Col key={image.id}>
                <Card>
                  <Card.Img variant="top" src={image.variants[0]} />
                  <Card.Body>
                    <Card.Title onClick={() => copyOnClick(image.filename)}>{image.filename}</Card.Title>
                    <Card.Text>
                      {image.meta && <>{image.meta.project} -> {image.meta.collection}</>}
                    </Card.Text>
                    <Button onClick={() => deleteImage(image)} variant="danger" size="sm">Delete</Button>
                    <UpdateModal image={image} />
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
