import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { UploadInterface } from '../interfaces/upload.interface';

@Injectable()
export class UploadService implements UploadInterface {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${uniqueFileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      console.log('Uploading file to S3 with params:', uploadParams);

      const uploadResult = await this.s3Client.send(
        new PutObjectCommand(uploadParams),
      );

      console.log('File uploaded successfully:', uploadResult);

      // Construct the URL manually since SDK v3 doesn't return Location
      const url = `https://${process.env.AWS_PUBLIC_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        url,
        key,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}
