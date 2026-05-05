import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('overview-stats')
  async getOverviewStats() {
    return this.nftService.getSummary();
  }

  @Get('ranking/stakers')
  async getTopStakers(@Query('limit') limit: number = 20) {
    return this.nftService.getTopStakers(limit);
  }

  @Get('ranking/stake')
  async getTopStakes(
    @Query('token') token: string = 'bcoin',
    @Query('network') network: string = 'all',
    @Query('limit') limit: number = 20,
  ) {
    return this.nftService.getTopStakes(token, network, limit);
  }

  @Get('ranking/global-stake')
  async getGlobalStakes(@Query('limit') limit: number = 20) {
    return this.nftService.getGlobalStakes(limit);
  }

  @Get('ranking/claim')
  async getTopClaims(
    @Query('token') token: string = 'bcoin',
    @Query('network') network: string = 'all',
    @Query('limit') limit: any = 10
  ) {
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    return this.nftService.getTopClaims(token, network, parsedLimit);
  }

  @Get('th/leaderboard')
  async getThLeaderboard() {
    return this.nftService.getThLeaderboard();
  }

  @Get()
  async getLatestNfts(
    @Query('network') network: string = 'all',
    @Query('owner') ownerAddress?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    const parsedLimit = limit ? Math.min(parseInt(limit.toString(), 10), 100) : 20;
    return this.nftService.getLatestNfts(network, ownerAddress, cursor, parsedLimit);
  }
}
