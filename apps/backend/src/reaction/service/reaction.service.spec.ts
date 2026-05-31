import { ReactionTargetType } from '@/reaction/domain';
import { ReactionRepository } from '@/reaction/repository';
import { ReactionService } from '@/reaction/service';

describe('ReactionService', () => {
  let service: ReactionService;
  let reactionRepository: jest.Mocked<ReactionRepository>;

  const db = {
    select: jest.fn(),
  };

  beforeEach(() => {
    reactionRepository = {
      findLike: jest.fn(),
      createLike: jest.fn(),
      softDeleteLike: jest.fn(),
      restoreLike: jest.fn(),
      countLikes: jest.fn(),
      countLikesByTargetIds: jest.fn(),
      findLikedTargetIds: jest.fn(),
    } as any;

    db.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 10 }]),
        }),
      }),
    });

    service = new ReactionService(reactionRepository, db as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a like when no row exists', async () => {
    reactionRepository.findLike.mockResolvedValue(null as any);
    reactionRepository.countLikes.mockResolvedValue(1);

    const result = await service.toggleLike(1, ReactionTargetType.POST, 10);

    expect(reactionRepository.createLike).toHaveBeenCalledWith(1, ReactionTargetType.POST, 10);
    expect(reactionRepository.restoreLike).not.toHaveBeenCalled();
    expect(result).toEqual({ liked: true, likeCount: 1 });
  });

  it('soft deletes an active like when toggled off', async () => {
    reactionRepository.findLike.mockResolvedValue({ id: 5, deleted: false } as any);
    reactionRepository.countLikes.mockResolvedValue(0);

    const result = await service.toggleLike(1, ReactionTargetType.POST, 10);

    expect(reactionRepository.softDeleteLike).toHaveBeenCalledWith(5);
    expect(reactionRepository.createLike).not.toHaveBeenCalled();
    expect(result).toEqual({ liked: false, likeCount: 0 });
  });

  it('restores a soft-deleted like instead of inserting a duplicate row', async () => {
    reactionRepository.findLike.mockResolvedValue({ id: 5, deleted: true } as any);
    reactionRepository.countLikes.mockResolvedValue(1);

    const result = await service.toggleLike(1, ReactionTargetType.POST, 10);

    expect(reactionRepository.restoreLike).toHaveBeenCalledWith(5);
    expect(reactionRepository.createLike).not.toHaveBeenCalled();
    expect(result).toEqual({ liked: true, likeCount: 1 });
  });
});
