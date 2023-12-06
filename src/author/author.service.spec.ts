import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from './dto/create-author.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthorService', () => {
  let authorService: AuthorService;
  let authorRepository: AuthorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: AuthorRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    authorService = module.get<AuthorService>(AuthorService);
    authorRepository = module.get<AuthorRepository>(AuthorRepository);
  });

  it('should be defined', () => {
    expect(authorService).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'Michael',
        lastName: 'Jordan',
      };
      await authorService.create(createAuthorDto);

      expect(authorRepository.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('getMany', () => {
    it('should get authors by ids', async () => {
      const authorIds = [1, 2, 3];
      const authors = [
        { id: 1, firstName: 'George', lastName: 'Benjamin' },
        { id: 2, firstName: 'Michael', lastName: 'Jordan' },
        { id: 3, firstName: 'Peter', lastName: 'Crouch' },
      ];

      jest.spyOn(authorRepository, 'findAll').mockResolvedValue(authors as any);

      const result = await authorService.getMany(authorIds);

      expect(authorRepository.findAll).toHaveBeenCalledWith({
        where: { id: authorIds },
      });
      expect(result).toEqual(authors);
    });

    it('should throw BadRequestException for invalid author ids', async () => {
      const authorIds = [1, 2, 3];
      jest.spyOn(authorRepository, 'findAll').mockResolvedValue([]);

      try {
        await authorService.getMany(authorIds);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `The following author ids are invalid: ${authorIds}`,
        );
      }
    });
  });
});
