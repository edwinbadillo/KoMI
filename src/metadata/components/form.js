import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Row, Col } from 'react-styled-flexboxgrid'

const MetadataModal = (props) => {

  const { readOnly, defaultValues, onSubmit, setReset } = props;

  const { control, handleSubmit, errors, reset, getValues } = useForm({ defaultValues });

  React.useEffect(() => {
    props.setFormData({
      metadata: {
        reset,
        getValues,
        errors,
        handleSubmit,
      }
    });
  }, [])


  console.log(errors);

  const fetchData = () => {
    const title = getValues('title'); // "test-input"
    props.search({ title });
    props.fetchData(title);
  }

  const textFieldStyle = {
    margin: '12px auto',
    display: 'flex',
  }

  return (
    <div>
      <form onSubmit={props.updateMetadata}>

        <div style={{ position: 'relative' }}>
          <Controller
            as={TextField}
            name="title"
            label="Title"
            placeholder="Title"
            control={control}
            variant="filled"
            style={textFieldStyle}
            inputProps={{
              readOnly: readOnly.title,
              'data-lpignore': "true"
            }}
          />
          <IconButton aria-label="search" style={{ position: 'absolute', top: 5, right: 0 }} onClick={fetchData}>
            <SearchIcon />
          </IconButton>
        </div>

        <Controller
          as={TextField}
          name="sortTitle"
          label="Sort Title"
          placeholder="Sort Title"
          control={control}

          variant="filled"
          style={textFieldStyle}
          inputProps={{
            readOnly: readOnly.sortTitle,
          }}

        />


        <Controller
          as={TextField}
          name="summary"
          label="Summary"
          placeholder="Summary"
          control={control}

          variant="filled"
          multiline
          style={textFieldStyle}
          inputProps={{
            readOnly: readOnly.summary,
          }}

        />
        <Row>
          <Col xs={6}>
            <Controller
              as={TextField}
              name="status"
              label="Status"
              placeholder="Status"
              control={control}

              variant="filled"
              style={textFieldStyle}
              inputProps={{
                readOnly: readOnly.status,
              }}

            />
          </Col>
          <Col xs={6}>
            <Controller
              as={TextField}
              name="language"
              label="Language"
              placeholder="Language"
              control={control}

              variant="filled"
              style={textFieldStyle}
              inputProps={{
                readOnly: readOnly.language,
              }}

            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>

            <Controller
              as={TextField}
              name="publisher"
              label="Publisher"
              placeholder="Publisher"
              control={control}

              variant="filled"
              style={textFieldStyle}
              inputProps={{
                readOnly: readOnly.publisher,
              }}

            />
          </Col>
          <Col xs={6}>
            <Controller
              as={TextField}
              name="ageRating"
              label="Age Rating"
              placeholder="Age Rating"
              control={control}

              variant="filled"
              style={textFieldStyle}
              inputProps={{
                readOnly: readOnly.ageRating,
              }}
            />
          </Col>
        </Row>

        <Controller
          as={TextField}
          name="genres"
          label="Genres"
          placeholder="Genres"
          control={control}

          variant="filled"
          style={textFieldStyle}
          inputProps={{
            readOnly: readOnly.genres,
          }}

        />

        <Controller
          as={TextField}
          name="tags"
          label="Tags"
          placeholder="Tags"
          control={control}

          variant="filled"
          style={textFieldStyle}
          inputProps={{
            readOnly: readOnly.tags,
          }}

        />
        <Button style={{ float: 'right' }} type="submit">Save Changes</Button>
      </form>
    </div>
  );
}

export default MetadataModal;
