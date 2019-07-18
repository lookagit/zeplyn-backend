import React from 'react';

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      uploadedImageUrl: null,
    };
  }
  fileSelectedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  }
  fileUploaderHandler = () => {
    const formData = new FormData();
    formData.append('file', this.state.selectedFile, this.state.selectedFile.name);
    fetch(`http://${process.env.REACT_APP_API_HOST}/api/images-upload`, {
      method: 'POST',
      body: formData
    })
      .then(result => result.json())
      .then((data) => {
        this.setState({
          uploadedImageUrl: data.imageUrl
        });
      });
  }
  render() {
    const { uploadedImageUrl } = this.state;
    return (
      <div>
        <input type="file" onChange={this.fileSelectedHandler} />
        <button onClick={this.fileUploaderHandler}>Upload</button>
        {
          uploadedImageUrl ?
            <div>
              <img
                  alt="uploaded"
                  src={`${uploadedImageUrl}`}
                  width="50"
                  height="50"
              />
            </div> : null
        }
      </div>
    );
  }
}

export default Uploader;
