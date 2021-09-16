.PHONY: vim_cleanup


vim_cleanup:
	find -iname '.*.swp' -exec mv '{}' ~/tmp/ ';'
