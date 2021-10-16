// const BLOCK_TYPE = {
//   0: 'STREAMINFO',
//   1: 'PADDING',
//   2: 'APPLICATION',
//   3: 'SEEKTABLE',
//   4: 'VORBIS_COMMENT', // There may be only one VORBIS_COMMENT block in a stream.
//   5: 'CUESHEET',
//   6: 'PICTURE',
// };

const STREAMINFO = 0;
const PADDING = 1;
const APPLICATION = 2;
const SEEKTABLE = 3;
const VORBIS_COMMENT = 4;
const CUESHEET = 5;
const PICTURE = 6;

const formatVorbisComment = (vendorString: string, commentList: []) => {
  const bufferArray = [];
  const vendorStringBuffer = Buffer.from(vendorString, 'utf8');
  const vendorLengthBuffer = Buffer.alloc(4);
  vendorLengthBuffer.writeUInt32LE(vendorStringBuffer.length);

  const userCommentListLengthBuffer = Buffer.alloc(4);
  userCommentListLengthBuffer.writeUInt32LE(commentList.length);

  bufferArray.push(vendorLengthBuffer, vendorStringBuffer, userCommentListLengthBuffer);

  for (let i = 0; i < commentList.length; i++) {
    const comment = commentList[i];
    const commentBuffer = Buffer.from(comment, 'utf8');
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(commentBuffer.length);
    bufferArray.push(lengthBuffer, commentBuffer);
  }

  return Buffer.concat(bufferArray);
};

class Metaflac {
  buffer: Buffer;
  marker: string;
  streamInfo: any;
  blocks: any[];
  padding: any;
  vorbisComment: any;
  vendorString: string;
  tags: any;
  pictures: Buffer[];
  picturesSpecs: object[];
  picturesDatas: string[];
  framesOffset: number;

  constructor(flac: Buffer) {
    this.buffer = flac;
    this.marker = '';
    this.streamInfo = null;
    this.blocks = [];
    this.padding = null;
    this.vorbisComment = null;
    this.vendorString = '';
    this.tags = [];
    this.pictures = [];
    this.picturesSpecs = [];
    this.picturesDatas = [];
    this.framesOffset = 0;
    this.init();
  }

  init() {
    let offset = 4;
    let blockType = 0;
    let isLastBlock = false;
    while (!isLastBlock) {
      blockType = this.buffer.readUInt8(offset++);
      isLastBlock = blockType >= 128;
      blockType = blockType % 128;

      const blockLength = this.buffer.readUIntBE(offset, 3);
      offset += 3;

      if (blockType === STREAMINFO) {
        this.streamInfo = this.buffer.slice(offset, offset + blockLength);
      }

      if (blockType === VORBIS_COMMENT) {
        this.vorbisComment = this.buffer.slice(offset, offset + blockLength);
        this.parseVorbisComment();
      }

      if ([APPLICATION, SEEKTABLE, CUESHEET].includes(blockType)) {
        this.blocks.push([blockType, this.buffer.slice(offset, offset + blockLength)]);
      }
      offset += blockLength;
    }
    this.framesOffset = offset;
  }

  parseVorbisComment() {
    const vendorLength = this.vorbisComment.readUInt32LE(0);
    this.vendorString = this.vorbisComment.slice(4, vendorLength + 4).toString('utf8');
  }

  parsePictureBlock() {
    this.pictures.forEach((picture: any) => {
      let offset = 0;
      const type = picture.readUInt32BE(offset);
      offset += 4;
      const mimeTypeLength = picture.readUInt32BE(offset);
      offset += 4;
      const mime = picture.slice(offset, offset + mimeTypeLength).toString('ascii');
      offset += mimeTypeLength;
      const descriptionLength = picture.readUInt32BE(offset);
      offset += 4;
      const description = picture.slice(offset, (offset += descriptionLength)).toString('utf8');
      const width = picture.readUInt32BE(offset);
      offset += 4;
      const height = picture.readUInt32BE(offset);
      offset += 4;
      const depth = picture.readUInt32BE(offset);
      offset += 4;
      const colors = picture.readUInt32BE(offset);
      offset += 4;
      const pictureDataLength = picture.readUInt32BE(offset);
      offset += 4;
      this.picturesDatas.push(picture.slice(offset, offset + pictureDataLength));
      this.picturesSpecs.push(
        this.buildSpecification({
          type,
          mime,
          description,
          width,
          height,
          depth,
          colors,
        }),
      );
    });
  }

  getPicturesSpecs() {
    return this.picturesSpecs;
  }

  /**
   * Get the MD5 signature from the STREAMINFO block.
   */
  getMd5sum() {
    return this.streamInfo.slice(18, 34).toString('hex');
  }

  /**
   * Get the minimum block size from the STREAMINFO block.
   */
  getMinBlocksize() {
    return this.streamInfo.readUInt16BE(0);
  }

  /**
   * Get the maximum block size from the STREAMINFO block.
   */
  getMaxBlocksize() {
    return this.streamInfo.readUInt16BE(2);
  }

  /**
   * Get the minimum frame size from the STREAMINFO block.
   */
  getMinFramesize() {
    return this.streamInfo.readUIntBE(4, 3);
  }

  /**
   * Get the maximum frame size from the STREAMINFO block.
   */
  getMaxFramesize() {
    return this.streamInfo.readUIntBE(7, 3);
  }

  /**
   * Get the sample rate from the STREAMINFO block.
   */
  getSampleRate() {
    // 20 bits number
    return this.streamInfo.readUIntBE(10, 3) >> 4;
  }

  /**
   * Get the number of channels from the STREAMINFO block.
   */
  getChannels() {
    // 3 bits
    return this.streamInfo.readUIntBE(10, 3) & (0x00000f >> 1);
  }

  /**
   * Get the # of bits per sample from the STREAMINFO block.
   */
  getBps() {
    return this.streamInfo.readUIntBE(12, 2) & (0x01f0 >> 4);
  }

  /**
   * Get the total # of samples from the STREAMINFO block.
   */
  getTotalSamples() {
    return this.streamInfo.readUIntBE(13, 5) & 0x0fffffffff;
  }

  /**
   * Show the vendor string from the VORBIS_COMMENT block.
   */
  getVendorTag() {
    return this.vendorString;
  }

  /**
   * Get all tags where the the field name matches NAME.
   *
   * @param {string} name
   */
  getTag(name: string) {
    return this.tags
      .filter((item: string) => {
        const itemName = item.split('=')[0];
        return itemName === name;
      })
      .join('\n');
  }

  /**
   * Remove all tags whose field name is NAME.
   *
   * @param {string} name
   */
  removeTag(name: string) {
    this.tags = this.tags.filter((item: string) => {
      const itemName = item.split('=')[0];
      return itemName !== name;
    });
  }

  /**
   * Remove first tag whose field name is NAME.
   *
   * @param {string} name
   */
  removeFirstTag(name: string) {
    const found = this.tags.findIndex((item: string) => {
      return item.split('=')[0] === name;
    });
    if (found !== -1) {
      this.tags.splice(found, 1);
    }
  }

  /**
   * Remove all tags, leaving only the vendor string.
   */
  removeAllTags() {
    this.tags = [];
  }

  /**
   * Add a tag.
   * The FIELD must comply with the Vorbis comment spec, of the form NAME=VALUE. If there is currently no tag block, one will be created.
   *
   * @param {string} field
   */
  setTag(field: string) {
    if (field.indexOf('=') === -1) {
      throw new Error(`malformed vorbis comment field "${field}", field contains no '=' character`);
    }
    this.tags.push(field);
  }

  /**
   * Import a picture and store it in a PICTURE metadata block.
   *
   * @param {string} filename
   */
  importPicture(picture: Buffer, dimension: number, mime: 'image/jpeg' | 'image/png') {
    const spec = this.buildSpecification({
      mime,
      width: dimension,
      height: dimension,
    });

    this.pictures.push(this.buildPictureBlock(picture, spec));
    this.picturesSpecs.push(spec);
  }

  /**
   * Return all tags.
   */
  getAllTags() {
    return this.tags;
  }

  buildSpecification(spec = {}) {
    const defaults = {
      type: 3,
      mime: 'image/jpeg',
      description: '',
      width: 0,
      height: 0,
      depth: 24,
      colors: 0,
    };
    return Object.assign(defaults, spec);
  }

  /**
   * Build a picture block.
   *
   * @param {Buffer} picture
   * @param {Object} specification
   * @returns {Buffer}
   */
  buildPictureBlock(picture: Buffer, specification: any = {}) {
    const pictureType = Buffer.alloc(4);
    const mimeLength = Buffer.alloc(4);
    const mime = Buffer.from(specification.mime, 'ascii');
    const descriptionLength = Buffer.alloc(4);
    const description = Buffer.from(specification.description, 'utf8');
    const width = Buffer.alloc(4);
    const height = Buffer.alloc(4);
    const depth = Buffer.alloc(4);
    const colors = Buffer.alloc(4);
    const pictureLength = Buffer.alloc(4);

    pictureType.writeUInt32BE(specification.type);
    mimeLength.writeUInt32BE(specification.mime.length);
    descriptionLength.writeUInt32BE(specification.description.length);
    width.writeUInt32BE(specification.width);
    height.writeUInt32BE(specification.height);
    depth.writeUInt32BE(specification.depth);
    colors.writeUInt32BE(specification.colors);
    pictureLength.writeUInt32BE(picture.length);

    return Buffer.concat([
      pictureType,
      mimeLength,
      mime,
      descriptionLength,
      description,
      width,
      height,
      depth,
      colors,
      pictureLength,
      picture,
    ]);
  }

  buildMetadataBlock(type: number, block: Buffer, isLast = false) {
    const header = Buffer.alloc(4);
    if (isLast) {
      type += 128;
    }
    header.writeUIntBE(type, 0, 1);
    header.writeUIntBE(block.length, 1, 3);
    return Buffer.concat([header, block]);
  }

  buildMetadata() {
    const bufferArray = [];
    bufferArray.push(this.buildMetadataBlock(STREAMINFO, this.streamInfo));
    this.blocks.forEach((block: Buffer) => {
      // @ts-ignore
      bufferArray.push(this.buildMetadataBlock(...block));
    });
    bufferArray.push(this.buildMetadataBlock(VORBIS_COMMENT, formatVorbisComment(this.vendorString, this.tags)));
    this.pictures.forEach((block: Buffer) => {
      bufferArray.push(this.buildMetadataBlock(PICTURE, block));
    });
    if (this.padding == null) {
      this.padding = Buffer.alloc(16384);
    }
    bufferArray.push(this.buildMetadataBlock(PADDING, this.padding, true));
    return bufferArray;
  }

  buildStream() {
    const metadata = this.buildMetadata();
    return [this.buffer.slice(0, 4), ...metadata, this.buffer.slice(this.framesOffset)];
  }

  /**
   * Save changes to buffer and return changed buffer
   */
  getBuffer() {
    return Buffer.from(Buffer.concat(this.buildStream()));
  }
}

export default Metaflac;
